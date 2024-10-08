#user_app.urls
from django.urls import path, include
from .views import Sign_up, Log_in, Log_out, Info, Master_Sign_Up

urlpatterns = [
    path('signup/', Sign_up.as_view(), name='signup'),
    path("login/", Log_in.as_view(), name="login"),
    path("logout/", Log_out.as_view(), name="logout"),
    path("info/", Info.as_view(), name="info"),
    path("master-signup/", Master_Sign_Up.as_view(), name="master"),
    path("garage/", include('garage_app.urls')),
    path("bounty/", include('bounty_list_app.urls')),
]