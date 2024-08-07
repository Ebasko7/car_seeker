from .models import Bounty_filter, Bounty_list
from rest_framework.serializers import ModelSerializer


class BountyFilterSerializer(ModelSerializer):
    class Meta:
        model = Bounty_filter
        fields = "__all__"

class BountyListSerializer(ModelSerializer):
    filters = BountyFilterSerializer(many=True)

    class Meta:
        model = Bounty_list
        fields = '__all__'