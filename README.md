# Progress - 

Day-1
- Connected to database
- WebScraped using playright
- Got distracted downloading zip file from Kaggle website
- Set up Kaggle CLI in local device & installed CSV files(thought I was on right)
- Read doc again and downloading CSV using playwright(blocker)

Day-2
- Blocked for a while on downloading file(learnt about launch, launchPersistentContext)
- Able to get excel file in local downloads folder in a format not useful(Blocked for a while)
- Able to download the zipped file and the dataset excel using stream, fs & zlib

Day-3
- Accessed the downloaded file using Admzip and stored content in SQL DB
- Got familiar with hubspot and created an account
- Sending multiple contacts to hubspot(blocker)

Day-4
- Blocked for a while on why the post request doesn't work
- Finally able to POST data in a batch of 100 FROM SQL to hubspot :)


# Brief Description of code -

- Using Playwright (with JavaScript) to automate the process of logging into Kaggle, navigating to the dataset page, and downloading the zip file containing the CSV file.
- Extract the CSV file from the zip, once the CSV file is downloaded, parsing it to extract the required fields (Name and Sex) and storing this data in a MySQL database using the Sequelize ORM.
- After storing the data in the database, using the HubSpot API to send this data to HubSpot and storing it there as Contacts.









# Production Level Code Requirements -

Proposal of steps to escalate this to a production level:

1. Setting up the code in a cloud environment - AWS, Azure. 
Using the cloud environment features and integrating the firewalls to protect the infrastructure. 
Configure load balancers for distributing traffic & ensuring high availability. 

2. Setting up a Deployment pipeline. 
Implementing a CI/CD pipeline would enable us to push code into production easily and roll back if any issue arises. 

3. Monitoring and logging. 
We can set up monitoring tools for our application which help us with - 
Early detection of issues, optimize performance, capacity planning. 
Implementing logging in our application would help us debug and troubleshoot. 

4. Scaling & High availability:
We could design auto scaling mechanisms which can automatically adjust resources based on demand. 
Implement database replication to ensure high availability and reduced downtime
Use distributed caching systems like redis for improved performance & scalability. 

5. Security and compliance:
Using the best practices such as encryption, authentication & authorization. 
Regularly update dependencies to patch security vulnerabilities.