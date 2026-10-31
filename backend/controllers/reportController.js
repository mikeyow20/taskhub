const Task = require("../models/Task");
const User = require("../models/User");
const excelJS = require("exceljs");

// @desc    Export all tasks as an Excel file
// @route   Get /api/reports/export/tasks
// @access  Private (Admin)
const exportTaskReport = async (req, res) => {
    try {
        const tasks = await Task.find().populate('assignedTo', 'name email');

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tasks Report");

        worksheet.columns = [
            { header: "ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 },
        ];

        tasks.forEach((task) => {
            // Ensure assignedTo is always an array
            const assignedUsers = Array.isArray(task.assignedTo)
                ? task.assignedTo
                : task.assignedTo
                ? [task.assignedTo]
                : [];

            const assignedToNames = assignedUsers
                .map((user) => user?.name || "Unknown")
                .join(", ");

            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate
                    ? task.dueDate.toISOString().split("T")[0]
                    : "N/A",
                assignedTo: assignedToNames || "Unassigned",
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=tasks-report.xlsx"
        );
        return workbook.xlsx.write(res).then(() => res.end());
    }
    catch (error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Export all users as an Excel file
// @route   Get /api/reports/export/users
// @access  Private (Admin)
const exportUserReport = async (req, res) => {
    try {
        const users = await User.find().select("name email _id").lean();
        const userTasks = await Task.find().populate('assignedTo', 'name email _id');

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                tasksCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTasks.forEach((task) => {
            if (task.assignedTo) {
                const assignedUsers = Array.isArray(task.assignedTo)
                    ? task.assignedTo
                    : [task.assignedTo]; // convert single to array

                assignedUsers.forEach((assignedUser) => {
                    const userId = assignedUser._id || assignedUser; // handle populated or ObjectId
                    if (userTaskMap[userId]) {
                        userTaskMap[userId].tasksCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[userId].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[userId].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[userId].completedTasks += 1;
                        }
                    }
                });
            }
        });

        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Users Task Report");

        worksheet.columns = [
            { header: "Username", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Tasks Count", key: "tasksCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];
        
        Object.values(userTaskMap).forEach((user) => {
            worksheet.addRow(user);
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=users_report.xlsx"
        );
        return workbook.xlsx.write(res).then(() => res.end());
    }
    catch (error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { exportTaskReport, exportUserReport };