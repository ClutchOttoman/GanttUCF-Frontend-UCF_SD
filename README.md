# GanttUCF - The free, all in one, Gantt chart solution
- This is the repo for the frontend portion of GanttUCF **only**
- [GanttUCF Backend](https://github.com/ClutchOttoman/Ganttify-Backend-UCF_SD)
- *Documented GitHub contributions are not equivalent to actual contributions from team members*
- Test for CI/CD

Frontend Component Documentation
Gantt Chart
|**File Name**||**Description**|
| :--- | :--- |
| Login.js | Handles user login and saves information to localStorage. |
| Register.js | User registration functionality. |
AddButton.js	Deprecated
AddTask.js	Deprecated
AddTaskButton.js	Floating add button on the View Chart page to create new tasks.
AddTaskDuration.js	Deprecated
GanttChart.js	Fetches project data and exports Gantt Charts as .csv/.pdf files.
Grid.js	Deprecated
ProjectHeader.js	Top navigation bar on View Chart page; allows project name changes.
ProjectTitle.js	Displays the project name (used within ProjectHeader.js).
RichTextEditor.js	Creates an RTF editor (ProseMirror) for task-related features.
Settings.js	Deprecated
TaskDetails.js	Modal for viewing and editing tasks.
Tasks.js	Categorizes and sorts tasks seen on the user’s screen.
TimeRange.js	Implements calendar views (Days, Weeks, Months) in the timetable.
TimeTable.js	Main timetable implementation in View Project page.
forcePatternColorChange.js	Adds colored patterns to the timetable.
getPattern.js	Converts SVG patterns to JSX patterns.
AboutUs.js	About Us page showcasing previous contributors.
AcceptInvite.js	Accept invite page for shared invite links.
AnnouncementModal.js	Displays patch notes to users at login; editable through DashboardAccount.js.
CardUI.js	Deprecated
ConfirmDelete.js	Confirm account deletion and send confirmation email (restorable within 72 hours).
ConfirmRestore.js	Allows users to restore their account within 72 hours.
Dashboard.js	Deprecated
DashboardAccount.js	User account page (edit details, reset password, delete account). Developers can upload announcements with devMode: "on".
DashboardCalender.js	Calendar functionality in the To-Do list page using FullCalendar.
DashboardCharts.js	Manages project cards on the dashboard.
DashboardChartsSearch.js	Search bar for finding projects by name on the dashboard.
DashboardNavBar.js	Sidebar navigation and project creation panel.
DashboardProjectCard.js	Edits and manages project card info.
DashboardToDo.js	Implements To-Do list table and calendar view toggle.
DeleteButtonIcon.js	SVG for the delete icon.
EditEmail.js	Edit email functionality within account settings.
ForgotPassword.js	Password recovery feature via email.
GanttifyDemo.js	Deprecated
LoggedInName.js	Deprecated
Login.js	Handles login, saves user data to localStorage.
NavBar.js	Header bar for all pages except View Chart page.
PageTitle.js	Deprecated
ProjectInviteLink.js	Provides project invite links and Discord bot links for task reminders.
RecentlyDeletedCharts.js	Manage recently deleted charts (permanently delete or restore).
RecentlyDeletedSearch.js	Search functionality for deleted charts.
Register.js	User registration functionality.
RegisterToken.js	Deprecated (?)
ResetPassword.js	Password reset functionality.
ThemeProvider.js	Applies theme changes from UI settings.
ToastConfirm.tsx	Toast notification for confirming an action.
ToastError.tsx	Toast notification for errors.
ToastNotify.tsx	General toast notification.
ToastSuccess.tsx	Toast notification for successful actions.
UIsettings.js	Hosts theme and font settings.
VerifyEmail.js / VerifyEmailToken.js	Verifies email after user clicks verification link.
Welcome.js	Welcome page component.
buildPath.js	Generates correct API build path (local or production environment).

Miscellaneous
Helpers/	Helper functions for date-related functionalities.
Pages/	Main GanttUCF pages.
Styles/	CSS for custom, dark, and high contrast modes.
Utils/	Deprecated
