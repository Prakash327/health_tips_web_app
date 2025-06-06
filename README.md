# health_tips_web_app
1.firstly att connection string of mongodb to connect to the database
2.and also create service_account folder and inside service_account folder add the firebase credentials
3. add cloudinary details to connect to cloudinary
{
mongouri=
cloud_name=
api_key=
api_secret=
}these are the variables to add in your .env file to spin up the project

routes :
authentication routes
1:post route: -->>(https:localhost:7000/user/register) to register user in firebase
2:post route: -->>(https:localhost:7000/user/login) to login user authentication is handeled by the firebase
3:get route: -->>(https:localhost:7000/user/getuser) 
to get user
4: get route:-->>(https:localhost:7000/profile) to get profile of the user 
5 : post route:-->>(https:localhost:7000/profile) to create prfile
6 : put route:-->>(https:localhost:7000/profile/:id)
to update profile
7 : delete route:-->>(https:localhost:7000/profile/:id)
to delete profile

9 : post route:-->>(https:localhost:7000/healthtips)
 to create health tips

10: put route:-->>(https:localhost:7000/healthtips/:id) to update health tips

11: get route:-->>(ttps:localhost:7000/healthtips)
to get health tips posted by logedin user
12: get route:-->>(ttps:localhost:7000/healthtips/:id)
get health tips by id
13: get route:-->>(ttps:localhost:7000/healthtips/all)
get all health tips present in database



