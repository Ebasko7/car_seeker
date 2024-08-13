from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT
from django.shortcuts import get_object_or_404
from .models import Bounty_list, Bounty_filter
from .serializers import BountyListSerializer, BountyFilterSerializer
from user_app.views import TokenReq

class BountyListView(TokenReq):
    def get(self, request):
        bounty_list = request.user.bounty_list
        serializer = BountyListSerializer(bounty_list)
        return Response(serializer.data, status=HTTP_200_OK)

class BountyFilterView(TokenReq):
    def post(self, request):
        serializer = BountyFilterSerializer(data=request.data)
        if serializer.is_valid():
            bounty_filter = serializer.save()
            request.user.bounty_list.filters.add(bounty_filter)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def get(self, request):
        filters = request.user.bounty_list.filters.all()
        serializer = BountyFilterSerializer(filters, many=True)
        return Response(serializer.data, status=HTTP_200_OK)

class BountyFilterDetailView(TokenReq):
    def get(self, request, filter_id):
        filter = get_object_or_404(Bounty_filter, id=filter_id, bounty_list__user=request.user)
        serializer = BountyFilterSerializer(filter)
        return Response(serializer.data, status=HTTP_200_OK)

    def put(self, request, filter_id):
        filter = get_object_or_404(Bounty_filter, id=filter_id, bounty_list__user=request.user)
        serializer = BountyFilterSerializer(filter, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_200_OK)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, filter_id):
        filter = get_object_or_404(Bounty_filter, id=filter_id, bounty_list__user=request.user)
        filter.delete()
        return Response(status=HTTP_204_NO_CONTENT)