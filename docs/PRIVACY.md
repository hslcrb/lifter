# Privacy
Lifter does not send webpage content anywhere. There are no analytics, accounts, ads, remote scripts or runtime requests. Original text stays in the current tab's isolated content-script memory until restore or navigation. Only the two preferences (lowercase and motion) are saved with chrome.storage.local.

Permissions: activeTab grants temporary access after the toolbar action; scripting injects the packaged engine; storage remembers preferences. There are no permanent host permissions.
