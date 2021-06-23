# To-Do List
Access at: https://todolist-ishaq.herokuapp.com/

This to-do list app uses Node.js and Express on the server-side and a MongoDB Atlas cluster to persist data.

## Custom Lists
You can make custom lists in this app (other than the default list on the home page).

To do this, simply add an extension to the URL with the name of the list.

For example, if I want to create a new list for my work-related to-do items, I will add "/work" to the URL
and hit enter to navigate to this new URL.

This will generate that new list in MongoDB and any items you now add in this list will persist in the database.