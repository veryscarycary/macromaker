# macromaker

React Native app for organizing fitness goals and managing macros.

<img src="https://user-images.githubusercontent.com/16945851/126695801-553d1477-e4b4-403b-a77a-0399b5a7059c.png" width="100" />

### LucidChart

- Serves as a way to diagram ideas before we spend time on wireframes

https://lucid.app/lucidchart/dc5f10e5-3a72-486f-9086-483d465563b4/edit?page=0_0#

### Figma

- Serves as a way to mock wireframes before we spend time on dev

https://www.figma.com/file/kDphCXUSYfVt3Qb1mwZxAW/Untitled?node-id=0%3A1


### Mission

To create a diet mobile app that focuses on the philosophy that properly handling macro ratios in tandem with calorie management will help to achieve fitness goals. This project is intended to follow an MVP approach. Higher level ideation is not out of the question, but the goal should be to focus on simple, core features to get to market in as little time as possible.

Here is a tentative feature list:

- Live record of today's calorie/macro intake
- History of previous days and their calorie/macro intakes
- Running average of total OR 7-day(or other amount) calorie/macro intake
- Notifications that alert you when, both daily and weekly(depending on goal):
    - Calorie deficit
    - Calorie surplus
    - Macro imbalance
- Add food form, to add nutrition information to today's running total
    - Includes both a manual entry as well as a search with food API/barcode integration
- Remove food from today's record (in the case of addition mistakes)


### Technical Notes

With the intention of keeping this a simple, usable, shippable app, billable third party services should be kept to a minumum as there is not a revenue model in place at this moment. Most of the functionality that we desire for the current MVP can be achieved by utilizing storage and utilities provided on the device, rather than depending on a remote service. That being said, we can expand to use those of the use case permits it.

