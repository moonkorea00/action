# release

## good to know

the lighthouse report tracker action will run only when pull requests are open, synchronized or reopened.

the github issue tracking your lighthouse report logs will be updated when a pull request is merged, meaning on subsequent pull requests, the most up to date lighthouse report used for comparison will be based on the previous pull request's lighthouse report.

note : if you have other actions set up where pull requests are open as a result of the action(i.e. dependabot, imgbot etc.), make sure to prevent your lighthouse ci workflow from running(unless you want it to be tracked) because when a pull request is merged, the lighthouse report tracker action will update the github issue light house report log used for subsequent pull requests.

ex)
```yml

// edit your workflow based on bots

```