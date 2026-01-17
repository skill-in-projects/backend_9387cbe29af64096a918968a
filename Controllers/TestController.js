const { Pool } = require('pg');

/**
 * @swagger
 * components:
 *   schemas:
 *     TestProject:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the project
 *         name:
 *           type: string
 *           description: The name of the project
 */

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Get all test projects
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: List of all test projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TestProject'
 */
const getAll = async (req, res, next) => {
    // Set search_path to public schema (required because isolated role has restricted search_path)
    await pool.query('SET search_path = public, "$user"');
        const result = await pool.query('SELECT "Id", "Name" FROM "TestProjects" ORDER BY "Id"');
        res.json(result.rows);
    // Do NOT catch generic errors - let them bubble up to global error handler middleware
};

/**
 * @swagger
 * /api/test/{id}:
 *   get:
 *     summary: Get a test project by ID
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: The project data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestProject'
 *       404:
 *         description: Project not found
 */
const getById = async (req, res, next) => {
    // Set search_path to public schema (required because isolated role has restricted search_path)
    await pool.query('SET search_path = public, "$user"');
        const { id } = req.params;
        const result = await pool.query('SELECT "Id", "Name" FROM "TestProjects" WHERE "Id" = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(result.rows[0]);
    // Do NOT catch generic errors - let them bubble up to global error handler middleware
};

/**
 * @swagger
 * /api/test:
 *   post:
 *     summary: Create a new test project
 *     tags: [Test]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestProject'
 *     responses:
 *       201:
 *         description: The created project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestProject'
 */
const create = async (req, res, next) => {
    // Set search_path to public schema (required because isolated role has restricted search_path)
    await pool.query('SET search_path = public, "$user"');
        const { name } = req.body;
        const result = await pool.query('INSERT INTO "TestProjects" ("Name") VALUES ($1) RETURNING "Id", "Name"', [name]);
        res.status(201).json(result.rows[0]);
    // Do NOT catch generic errors - let them bubble up to global error handler middleware
};

/**
 * @swagger
 * /api/test/{id}:
 *   put:
 *     summary: Update a test project
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestProject'
 *     responses:
 *       200:
 *         description: The updated project
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestProject'
 *       404:
 *         description: Project not found
 */
const update = async (req, res, next) => {
    // Set search_path to public schema (required because isolated role has restricted search_path)
    await pool.query('SET search_path = public, "$user"');
        const { id } = req.params;
        const { name } = req.body;
        const result = await pool.query('UPDATE "TestProjects" SET "Name" = $1 WHERE "Id" = $2 RETURNING "Id", "Name"', [name, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(result.rows[0]);
    // Do NOT catch generic errors - let them bubble up to global error handler middleware
};

/**
 * @swagger
 * /api/test/{id}:
 *   delete:
 *     summary: Delete a test project
 *     tags: [Test]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The project ID
 *     responses:
 *       200:
 *         description: Success message
 *       404:
 *         description: Project not found
 */
const remove = async (req, res, next) => {
    // Set search_path to public schema (required because isolated role has restricted search_path)
    await pool.query('SET search_path = public, "$user"');
        const { id } = req.params;
        const result = await pool.query('DELETE FROM "TestProjects" WHERE "Id" = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Deleted successfully' });
    // Do NOT catch generic errors - let them bubble up to global error handler middleware
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
