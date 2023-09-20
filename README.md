# BlockStakReportManagementMERN

### To Run the app (Server)

##### make sure, you are in BlockStakReportManagementMERN/ directory & type the following command

```sh
$ docker-compose up -d
```
##### API server will run on port 4000

### Created  all necessary  api endpoints for user registration, login, add  report, view report, edit report and delete report
## API Endpoints
* /users/register - register user with required informations
* /users/login - login user with email and password - this will generate a jwt token with an expiration time of one hour and sent back  with cookie
* /users/refreshToken - this will generate a refresh token if the user is active and token expires
* /reports/viewReport - this will return all reports (for admin and regular users)
* /reports/addReport - admin user can add report
* /reports/editReport/:id - admin user can edit  report
* /reports/deleteReport/:id - admin user can delete report
  
# Postman Collection
You can find the postman collection [here](https://github.com/Shahrear002/BlockStakReportManagementMERN/blob/main/server/ReportManagement.postman_collection.json) 
Or you can check <a href="https://documenter.getpostman.com/view/4921692/2s9YC4VYp2" target="_blank">this</a> postman documentation to test the API endpoints.
