from django.urls import path
from .views import BountyListView, BountyFilterView, BountyFilterDetailView

urlpatterns = [
    path('', BountyListView.as_view(), name='bounty-list'),
    path('bounty-filters/', BountyFilterView.as_view(), name='bounty-filters'),
    path('bounty-filters/<int:filter_id>/', BountyFilterDetailView.as_view(), name='bounty-filter-detail'),
]