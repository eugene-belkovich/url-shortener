# Url Shortener Requirements
## ORIGINAL:

- [ ] Build a React application that allows you enter a URL
- [ ] When the form is submitted, return a shortened version of the URL
- [x] Save a record of the shortened URL to a database
- [x] Ensure the slug of the URL (abc123 in the screenshot above) is unique
- [x] When the shortened URL is accessed, redirect to the stored URL
- [x] If an invalid slug is accessed, display a 404 Not Found page
- [x] You should have a list of all URLs saved in the database


Extra Credit:
- [ ] Add support for accounts so people can view the URLs they have created
- [ ] Validate the URL provided is an actual URL
- [ ] Display an error message if invalid
- [ ] Make it easy to copy the shortened URL to the clipboard
- [x] Allow users to modify the slug of their URL
- [x] Track visits to the shortened URL
- [ ] Add rate-limiting to prevent bad-actors
- [ ] Add a dashboard showing how popular your URLs are
- [x] Build a Docker image of your application


## MY 
- [x] initial nest.js project setup
- [x] generate unique slug
- [x] validate initial url that is url -> pattern validation
- [x] if url invalid -> error
- [x] create and save to db
- [x] no duplicates on create, isExist

work:
- [x] if slug correct -> redirect to url
- [x] incr visit (create separate table with count)
- [x] if slug invalid -> error
- [x] list of all urls
- [x] using 302 redirect instead of 301 redirect because better to analytics nad avoid cahce
- [x] update slug
- [x] if new is unique -> save
- [x] if new is not unique -> error

- [x] add analytics
- [x] add ip support
- [x] add tx support
- [ ] add rate limiting
- [ ] analytics get all
- [x] add user support


- [ ] check&add transaction if needed
- [ ] check&add basic index


BACKEND:
- [x] Save a record of the shortened URL to a database
- [x] Ensure the slug of the URL (abc123 in the screenshot above) is unique
- [x] When the shortened URL is accessed, redirect to the stored URL
- [x] If an invalid slug is accessed, rerudrn error
- [x] You should have a list of all URLs saved in the database
- [x] Allow users to modify the slug of their URL
- [x] Build a Docker image of your application
- [x] Track visits to the shortened URL
- [ ] Add rate-limiting to prevent bad-actors


FRONTEND:
- [ ] Add support for accounts so people can view the URLs they have created
- [ ] Allow users to modify the slug of their URL
- [ ] Build a React application that allows you enter a URL
- [ ] When the form is submitted, return a shortened version of the URL
- [ ] If an invalid slug is accessed, display a 404 Not Found page
- [ ] Validate the URL provided is an actual URL
- [ ] Display an error message if invalid
- [ ] Make it easy to copy the shortened URL to the clipboard
- [ ] Add a dashboard showing how popular your URLs are
