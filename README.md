# GanttUCF - The free, all in one, Gantt chart solution
- This is the repo for the frontend portion of GanttUCF **only**
- [GanttUCF Backend](https://github.com/ClutchOttoman/Ganttify-Backend-UCF_SD)
- *Documented GitHub contributions are not equivalent to actual contributions from team members*
- Test for CI/CD

Component | Description
AddButton.js | Deprecated
AddTask.js | Deprecated
AddTaskButton.js | Floating add button in the View Chart page; creates new tasks.
AddTaskDuration.js | Deprecated
GanttChart.js | Fetches project data from the database and exports Gantt charts as .csv/.pdf.
Grid.js | Deprecated
ProjectHeader.js | Top navigation bar in View Chart page; allows project name changes by the project creator.
ProjectTitle.js | Displays the project name (used within ProjectHeader.js).
RichTextEditor.js | Rich Text Editor (ProseMirror) for task-related features (add, edit, view descriptions).
Settings.js | Deprecated
TaskDetails.js | Modal for viewing and editing tasks.
Tasks.js | Categorizes and sorts tasks on the user's screen.
TimeRange.js | Implements different calendar views (Days, Weeks, Months).
TimeTable.js | Implements the timetable in the View Project page.
forcePatternColorChange.js | Implements colored patterns in the timetable.
getPattern.js | Changes SVG patterns to JSX patterns.
AboutUs.js | About Us page showcasing previous contributors.
AcceptInvite.js | Accept Invite page via shared invite links.
AnnouncementModal.js | Displays patch notes to users; editable by developers through DashboardAccount.js.
CardUI.js | Deprecated
ConfirmDelete.js | Confirms account deletion and sends confirmation email (restorable within 72 hours).
ConfirmRestore.js | Allows account restoration within 72 hours.
Dashboard.js | Deprecated
DashboardAccount.js | User account settings page (email, password reset, account deletion); developers can post announcements.
DashboardCalender.js | Implements calendar in the To-Do list page using FullCalendar.
DashboardCharts.js | Manages creation and organization of project cards on the dashboard page.
DashboardChartsSearch.js | Implements dashboard search bar for projects by name.
DashboardNavBar.js | Sidebar for navigation and project creation.
DashboardProjectCard.js | Manages and edits project card information.
DashboardToDo.js | To-Do list table and calendar view toggle on the To-Do/Home page.
DeleteButtonIcon.js | SVG for the delete icon.
EditEmail.js | Email edit functionality in account settings.
ForgotPassword.js | Password recovery feature via email.
GanttifyDemo.js | Deprecated
LoggedInName.js | Deprecated
Login.js | Handles user login and stores user data in localStorage.
NavBar.js | Header bar used on all pages except View Chart.
PageTitle.js | Deprecated
ProjectInviteLink.js | Provides project invite links and Discord bot links for task reminders (in NavBar on View Chart page).
RecentlyDeletedCharts.js | Manages recently deleted charts (permanent delete or restore).
RecentlyDeletedSearch.js | Search functionality for recently deleted charts.
Register.js | User registration functionality.
RegisterToken.js | Deprecated (?)
ResetPassword.js | Implements password reset functionality.
ThemeProvider.js | Wrapper for applying theme changes from the UI settings.
ToastConfirm.tsx | Toast notification for confirming actions.
ToastError.tsx | Toast notification for errors.
ToastNotify.tsx | General-purpose toast notifications.
ToastSuccess.tsx | Toast notification for successful actions.
UIsettings.js | Manages theme and font settings.
VerifyEmail.js / VerifyEmailToken.js | Verifies email addresses upon registration through emailed links.
Welcome.js | Welcome page component.
buildPath.js | Generates the correct API build path (local or production).
