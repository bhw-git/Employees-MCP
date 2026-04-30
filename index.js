import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.SPRING_BASE_URL || "http://localhost:8080";
const api = axios.create({ baseURL: BASE_URL });

const server = new McpServer({
  name: "ems-mcp-server",
  version: "1.0.0",
});

// ─────────────────────────────────────────
// 👤 EMPLOYEE TOOLS
// ─────────────────────────────────────────

server.tool(
  "get-all-employees",
  "Fetch all employees from the Employee Management System",
  {},
  async () => {
    const res = await api.get("/api/employees");
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "get-employee-by-id",
  "Fetch a single employee by their ID",
  { id: z.number().describe("Employee ID") },
  async ({ id }) => {
    const res = await api.get(`/api/employees/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "create-employee",
  "Create a new employee",
  {
    firstName: z.string().describe("Employee first name"),
    lastName: z.string().describe("Employee last name"),
    email: z.string().describe("Employee email"),
    departmentId: z.string().describe("Department Id"),
  },
  async (employeeDto) => {
    const res = await api.post("/api/employees", employeeDto);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "update-employee",
  "Update an existing employee by ID",
  {
    id: z.number().describe("Employee ID to update"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    departmentId: z.string().optional(),
  },
  async ({ id, ...employeeDto }) => {
    const res = await api.put(`/api/employees/${id}`, employeeDto);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "delete-employee",
  "Delete an employee by ID",
  { id: z.number().describe("Employee ID to delete") },
  async ({ id }) => {
    const res = await api.delete(`/api/employees/${id}`);
    return { content: [{ type: "text", text: res.data }] };
  }
);

// ─────────────────────────────────────────
// 🏢 DEPARTMENT TOOLS
// ─────────────────────────────────────────

server.tool(
  "get-all-departments",
  "Fetch all departments",
  {},
  async () => {
    const res = await api.get("/api/departments");
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "get-department-by-id",
  "Fetch a department by its ID",
  { id: z.number().describe("Department ID") },
  async ({ id }) => {
    const res = await api.get(`/api/departments/${id}`);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "create-department",
  "Create a new department",
  {
    departmentName: z.string().describe("Department name"),
    departmentDescription: z.string().describe("Department description"),
  },
  async (departmentDto) => {
    const res = await api.post("/api/departments", departmentDto);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "update-department",
  "Update an existing department by ID",
  {
    id: z.number().describe("Department ID to update"),
    departmentName: z.string().optional(),
    departmentDescription: z.string().optional(),
  },
  async ({ id, ...departmentDto }) => {
    const res = await api.put(`/api/departments/${id}`, departmentDto);
    return { content: [{ type: "text", text: JSON.stringify(res.data, null, 2) }] };
  }
);

server.tool(
  "delete-department",
  "Delete a department by ID",
  { id: z.number().describe("Department ID to delete") },
  async ({ id }) => {
    const res = await api.delete(`/api/departments/${id}`);
    return { content: [{ type: "text", text: res.data }] };
  }
);

// ─────────────────────────────────────────
// 🚀 START SERVER
// ─────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("EMS MCP Server running...");