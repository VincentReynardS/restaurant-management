# Restaurant Management Backend
This project uses TypeScript with NestJS as the main framework, as for the database, PostgreSQL is selected based on the requirement. This app will automatically sync the database schema, so we do not need to create the tables and relations manually (note that this is for development purpose only).

## How to run
To configure the database connection settings (e.g host, username, etc), please modify the `.env.development` file. Below is a configuration example:
```
PG_HOST='localhost'
PG_USERNAME='service'
PG_PASSWORD='service123'
PG_DATABASE='restaurant-db'
TYPEORM_SYNC=true #this configuration tells the app to sync the database in PostgreSQL, use in development/testing only.
```

To run the unit tests, run below command:
```
npm run test:watch
#or
npm run test
```

To run the this app, run below command:
```
npm run start:dev
```

A postman collection file, `postman_collection.json`, is also provided, you can import it in postman app to test the app.
And/or you can also view the generated Postman API documentation through this site: https://documenter.getpostman.com/view/12186512/U16kqjix
