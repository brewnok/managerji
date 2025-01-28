// vite.config.ts
import { defineConfig } from "file:///F:/Client/Hotel-Management/hms2/project/node_modules/vite/dist/node/index.js";
import react from "file:///F:/Client/Hotel-Management/hms2/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import express from "file:///F:/Client/Hotel-Management/hms2/project/node_modules/express/index.js";
import fs from "fs/promises";
import path from "path";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "checkout-api",
      configureServer(server) {
        server.middlewares.use(express.json());
        server.middlewares.use("/api/saveCheckout", async (req, res) => {
          if (req.method === "POST") {
            try {
              const checkoutData = req.body;
              const filePath = path.resolve("roomdata.json");
              let existingData = [];
              try {
                const fileContent = await fs.readFile(filePath, "utf-8");
                existingData = JSON.parse(fileContent);
              } catch (error) {
              }
              existingData.push(checkoutData);
              await fs.writeFile(filePath, JSON.stringify(existingData, null, 2));
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ success: true }));
            } catch (error) {
              console.error("Error saving checkout data:", error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Failed to save checkout data" }));
            }
          } else {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
          }
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxDbGllbnRcXFxcSG90ZWwtTWFuYWdlbWVudFxcXFxobXMyXFxcXHByb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXENsaWVudFxcXFxIb3RlbC1NYW5hZ2VtZW50XFxcXGhtczJcXFxccHJvamVjdFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovQ2xpZW50L0hvdGVsLU1hbmFnZW1lbnQvaG1zMi9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMvcHJvbWlzZXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB7XG4gICAgICBuYW1lOiAnY2hlY2tvdXQtYXBpJyxcbiAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZShleHByZXNzLmpzb24oKSk7XG4gICAgICAgIFxuICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKCcvYXBpL3NhdmVDaGVja291dCcsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXEubWV0aG9kID09PSAnUE9TVCcpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNoZWNrb3V0RGF0YSA9IHJlcS5ib2R5O1xuICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZSgncm9vbWRhdGEuanNvbicpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgbGV0IGV4aXN0aW5nRGF0YSA9IFtdO1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZVBhdGgsICd1dGYtOCcpO1xuICAgICAgICAgICAgICAgIGV4aXN0aW5nRGF0YSA9IEpTT04ucGFyc2UoZmlsZUNvbnRlbnQpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIEZpbGUgZG9lc24ndCBleGlzdCB5ZXQsIHN0YXJ0IHdpdGggZW1wdHkgYXJyYXlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgZXhpc3RpbmdEYXRhLnB1c2goY2hlY2tvdXREYXRhKTtcbiAgICAgICAgICAgICAgYXdhaXQgZnMud3JpdGVGaWxlKGZpbGVQYXRoLCBKU09OLnN0cmluZ2lmeShleGlzdGluZ0RhdGEsIG51bGwsIDIpKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBzdWNjZXNzOiB0cnVlIH0pKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNhdmluZyBjaGVja291dCBkYXRhOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA1MDA7XG4gICAgICAgICAgICAgIHJlcy5lbmQoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0ZhaWxlZCB0byBzYXZlIGNoZWNrb3V0IGRhdGEnIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDU7XG4gICAgICAgICAgICByZXMuZW5kKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdNZXRob2Qgbm90IGFsbG93ZWQnIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9LFxuICBdLFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBleGNsdWRlOiBbJ2x1Y2lkZS1yZWFjdCddLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFpVCxTQUFTLG9CQUFvQjtBQUM5VSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sUUFBUTtBQUNmLE9BQU8sVUFBVTtBQUdqQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTjtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sZ0JBQWdCLFFBQVE7QUFDdEIsZUFBTyxZQUFZLElBQUksUUFBUSxLQUFLLENBQUM7QUFFckMsZUFBTyxZQUFZLElBQUkscUJBQXFCLE9BQU8sS0FBSyxRQUFRO0FBQzlELGNBQUksSUFBSSxXQUFXLFFBQVE7QUFDekIsZ0JBQUk7QUFDRixvQkFBTSxlQUFlLElBQUk7QUFDekIsb0JBQU0sV0FBVyxLQUFLLFFBQVEsZUFBZTtBQUU3QyxrQkFBSSxlQUFlLENBQUM7QUFDcEIsa0JBQUk7QUFDRixzQkFBTSxjQUFjLE1BQU0sR0FBRyxTQUFTLFVBQVUsT0FBTztBQUN2RCwrQkFBZSxLQUFLLE1BQU0sV0FBVztBQUFBLGNBQ3ZDLFNBQVMsT0FBTztBQUFBLGNBRWhCO0FBRUEsMkJBQWEsS0FBSyxZQUFZO0FBQzlCLG9CQUFNLEdBQUcsVUFBVSxVQUFVLEtBQUssVUFBVSxjQUFjLE1BQU0sQ0FBQyxDQUFDO0FBRWxFLGtCQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxrQkFBSSxJQUFJLEtBQUssVUFBVSxFQUFFLFNBQVMsS0FBSyxDQUFDLENBQUM7QUFBQSxZQUMzQyxTQUFTLE9BQU87QUFDZCxzQkFBUSxNQUFNLCtCQUErQixLQUFLO0FBQ2xELGtCQUFJLGFBQWE7QUFDakIsa0JBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPLCtCQUErQixDQUFDLENBQUM7QUFBQSxZQUNuRTtBQUFBLFVBQ0YsT0FBTztBQUNMLGdCQUFJLGFBQWE7QUFDakIsZ0JBQUksSUFBSSxLQUFLLFVBQVUsRUFBRSxPQUFPLHFCQUFxQixDQUFDLENBQUM7QUFBQSxVQUN6RDtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
