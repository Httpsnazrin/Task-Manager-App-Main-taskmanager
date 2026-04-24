const db = require('../config/database');

exports.getTasks = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC', 
            [req.user.id]
        );
        res.render('dashboard', { user: req.user, tasks: rows });
    } catch (err) {
        res.status(500).send('Error loading dashboard');
    }
};

exports.createTask = async (req, res) => {
    const { title, description, priority, due_date } = req.body;
    try {
        await db.execute(
            'INSERT INTO tasks (user_id, title, description, priority, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, title, description || '', priority || 'Medium', due_date || null, 'Pending']
        );
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Error creating task');
    }
};

exports.updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?', [status, id, req.user.id]);
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Update failed');
    }
};

exports.editTaskFull = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, due_date } = req.body;
    try {
        await db.execute(
            'UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ? WHERE id = ? AND user_id = ?',
            [title, description || '', priority, due_date || null, id, req.user.id]
        );
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Edit failed');
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, req.user.id]);
        res.redirect('/dashboard');
    } catch (err) {
        res.status(500).send('Delete failed');
    }
};