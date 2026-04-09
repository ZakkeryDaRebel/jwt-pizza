# Deliverable 12 Penetration Testing

## Peer Names

- Tristan Weech
- Makenna Wilkerson

## Self Attack

### Tristan

#### Self Attack #1

| Item           | Result                                                                                                                                                                                                                                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 7, 2026                                                                                                                                                                                                                                                                                                                     |
| Target         | pizza.twpizza.click                                                                                                                                                                                                                                                                                                               |
| Classification | Password Attacks                                                                                                                                                                                                                                                                                                                  |
| Severity       | 4                                                                                                                                                                                                                                                                                                                                 |
| Description    | Through password attacks, my base admin account was found out and hacked. Not only was this hacking done through a simple password that a hacker could easily figure out and break into, it also revealed how logging in with an empty string password would be successful.                                                       |
| Images         | ![Burp Suite Password Attacking](./TWPasswordAttacking.png) <br/> Burp Suite photo of password attacking after I had secured my system.                                                                                                                                                                                           |
| Corrections    | I have now changed my base admin account to have a more secure password, and I also have made it so that if you enter a password that is just empty strings, it fails to log the user in, in addition to a counter on how many times someone is trying to log in to stop hackers from password attacking or dictionary attacking. |

#### Self Attack #2

| Item           | Result                                                                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 7, 2026                                                                                                                                                                                                                                                         |
| Target         | pizza.twpizza.click                                                                                                                                                                                                                                                   |
| Classification | Man-in-the-Middle                                                                                                                                                                                                                                                     |
| Severity       | 4                                                                                                                                                                                                                                                                     |
| Description    | Users could use a Man-in-the-Middle software/middleware to adjust the order HTTP request to change different aspects of it, such as ordering from a different store, or worse off, having the cost of the pizza be negative value, which made the company lose money. |
| Images         | ![Grafana Negative Revenue](./TWMITMMoney.png) <br/> Grafana showing how damaging this Man in the Middle attack can be.                                                                                                                                               |
| Corrections    | Now when a order comes in, I verify all the information that comes in with data from the backend to ensure that nothing is changed by a malicious user.                                                                                                               |

#### Self Attack #3

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | april 9, 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Target         | pizza.twpizza.click                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Classification | Insider Threats                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Severity       | 4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Description    | By having insider information, you can go to the Github repository of the backend, and if it hasn't been cleared recently, you can look into the workflows and snag very important classified information from downloading the artifact. This can include information such as jwtSecret, db connection information (host, user, password, database, connectTimeout), factory url and api key, metrics info (source, endpointUrl, apiKey, accountId), and logging info (source, endpointUrl, accountId, and apiKey). With this information, they could hack into the database, or use the jwtSecret to sign invalid pizza orders. |
| Images         | ![Github Config Secrets](./TWGithubConfig.png) <br/> Github keeping the artifact that was used, which in turn can be downloaded and contains all the config file secrets that were meant to be kept hidden.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Corrections    | I am ensuring that as I have finished the workflow, I am going through and deleted the artifacts, and deleting older workflows as well that are no longer needed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

#### Self Attack #4

| Item           | Result                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 9, 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Target         | pizza.twpizza.click                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Classification | Insider Threats                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Severity       | 1                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Description    | Going to the Grafana logs, you can look into information that can lead to having insider information. But thanks to our Deliverable 9 (Logging), I was able to sanitize the lgos beforehand, and hide the most important information away from malicious eyes. But there is still some information that could be used to have an understanding of what is happening in the backend, but I don't believe it as anything too important that would harm users or the company. |
| Images         | ![Grafana's Sanitized Logs](./TWGrafanaSanitization.png) <br/> Because the Grafana logs are sanitized, little to none important information has been shared to those who shouldn't have the information.                                                                                                                                                                                                                                                                   |
| Corrections    | Nothing at the moment, but a discussion could be undertaken to debate what information should be sanitzied and aren't currently..                                                                                                                                                                                                                                                                                                                                          |

### Makenna

#### Self Attack #1

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Self Attack #2

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Self Attack #3

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Self Attack #4

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Self Attack #5

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

## Peer Attack

### Tristan toward Makenna's website

#### Attack #1

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #2

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #3

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #4

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #5

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

### Makenna toward Tristan's website

#### Attack #1

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #2

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #3

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #4

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

#### Attack #5

| Item           | Result                                                          |
| -------------- | --------------------------------------------------------------- |
| Date           | June 18, 2053                                                   |
| Target         | pizza.byucsstudent.click                                        |
| Classification | Injection                                                       |
| Severity       | 1                                                               |
| Description    | SQL injection deleted database. All application data destroyed. |
| Images         | _add photo_                                                     |
| Corrections    | Sanitize user inputs.                                           |

## Summary of learning

summary
