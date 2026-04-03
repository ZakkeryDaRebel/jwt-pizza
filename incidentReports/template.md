# Incident: 2026-04-03 11:00:30

## Summary

At 11:00:30 MDT on 2026-04-03 a user tried to order a single Veggie pizza, and the pizza order failed to be fulfilled at the factory.

Though there was 0 alerts sent out, this lasted until 12:03:14 MDT on 2026-04-03 when an Admin looked at Grafana, noticed high latency spikes in pizza order, and decided to test the system. The Admin then tried to order a pizza and noticed that the pizza order failed, so he proceeded to look into the logs, noticed the issue with the pizza factory and fixed the issue.

This means for a whole hour, pizzas were unable to be purchased, affecting roughly 30 users, and 70 pizza orders. This would classifiy as a SEV-2, affecting 3%-90% of our users, even though 0 support tickets, social media mentions, or calls were raised about this incident.

## Detection

This incident was not detected by any alerts.

Around 12:00:00 MDT, an Admin was checking on the system to see if there was any problems with the system. They first checked the Grafana dashboard, and noticed 5 spikes in pizza order latency between 8:30:00 and 10:30:00 MDT where it was taking 30 seconds to order a pizza.

After noticing the huge latency spikes, the Admin went to order a pizza themselves to see what was the problem with the latency, and instead noticed that the pizza order failed to be fulfilled at the factory.

The admin then set up a new Detection where if the Failed Pizza order count is higher than the Successful Pizza order count, then an alert is sent. This way, if there are no more successful pizza orders, then the failed pizza count will be higher, an alert will be sent out, and this problem can be resolved a lot sooner than 1 hour.

## Impact

For 1hr 3min between 11:00:30 MDT and 12:03:14 MDT on 2026-04-03, our users found that their pizza orders were failed to be fulfilled at the factory.

This incident affected roughly 30 users, or 1 user 30 times, (30 users is 90% of our users, while 1 user is 3% of our users), who experienced this pizza order failure.

0 support tickets or social media posts were brought up about this issue.

## Timeline

All times are MDT

- _08:41_ - First latency spike in pizza order of 32 seconds occured
- _08:52_ - Second latency spike in pizza order of 32 seconds occured
- _09:31_ - Third latency spike in pizza order of 32 seconds occured
- _09:42_ - Fourth latency spike in pizza order of 16 seconds occured
- _10:21_ - Fifth latency spike in pizza order of 32 seconds occured
- _11:01_ - All pizza orders started to fail, dropping successful pizza orders count to 0
- _12:03_ - Admin noticed the latency spike and tried to order a pizza, noticed the failure
- _12:04_ - Admin looked through the logs and found the problem and fixed it, allowing users to successfully order pizzas again

## Response

At 12:03:14 MDT on 2026-04-03, Tristan, the admin, came online to check Grafana and the logs, and noticed some weird spikes in the pizza order latency. Then manually checked to see what else he can find out when he noticed he couldn't order pizzas.

## Root cause

The problem occured from pizzas being ordered, and the pizza factory got overwhelmed from the amount of pizzas ordered.

## Resolution

The pizza orders came back online after the admin looked into the logs and went to the problem at hand and fixed it (by clicking on a link). This resolved the issue, and was ensured was resolved by the admin ordering a pizza, and having it work, then checking the logs for the next 10 or so minutes as users were once again able to purchase pizzas.

In order to improve the mitigation time, there could have been more and better alerts to keep track of the situation. With these better alerts the admins and JWT team could have seen this problem earlier and fixed these problems a lot sooner than 1 hour.

## Prevention

The root cause is a bit confusing, it could be from the pizza factory just failing, too many orders were occuring, or too many orders with big pizzas were occuring which caused the factory to fail. So while the root cause may not be 100% verified, we can keep a better eye on the orders, adding more alerts, logging, tests, and preventative measures to help us better understand what the problem was, and resolve future issues a lot quicker as well.

## Action items

1. Look into the cause of Grafana's alerting so we can figure out why we didn't catch the latency problem
1. Disucss other actionable alerts we can undergo about pizza orders and latency to ensure our system is working efficiently
1. Ensure that we have more team members available, Tristan the Admin was busy until 12 and that was when he was able to check the system. If we had more team members available, we could have this mitigation happen sooner
1. If we don't have more team members available, figure out how to incorporate AI into the mitigation strategy to have AI solve these issues as soon as they arise.
