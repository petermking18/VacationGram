### TO DO
-    identify calls where user_id doesn't exist and don't return success (/api/user/:id/trips, for example)

### PLANNING NOTES
-    update user, prepopulate front end with get, take in all information and update all given fields without data validation
-    search use params, default pass
        
### DONE
-    pluralize routes
-    count response amount for returning all trips, likes, users, comments
-    for responses on post, need to return full updated information
-    remove username field, keep only name
-    clean up code on mysql error states
-    remove replies to comments [not removed, decided to leave feature in but not use]