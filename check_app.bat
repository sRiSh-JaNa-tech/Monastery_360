@echo off
setlocal

echo Checking Next.js application and API functionality...

:: Step 1: Check if Next.js server is running
echo.
echo Step 1: Checking if Next.js server is running on localhost:3000...
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:3000/planner
echo Expected: Status: 200 (server running, /planner accessible)
echo If not running, run 'npm run dev' in C:\Users\srish\Downloads\monastery360 (2)
echo.

:: Step 2: Test the /api/generate-itinerary endpoint
echo Step 2: Testing API route /api/generate-itinerary...
curl -s -X POST -H "Content-Type: application/json" -d "{\"prompt\":\"budget trip\",\"days\":3}" http://localhost:3000/api/generate-itinerary
echo.
echo Expected: JSON like [{"id":"day-1","title":"Day 1","items":["pine-grove","mountain-view-cafe","teesta-view"]}]
echo If 404, ensure pages/api/generate-itinerary.js exists.
echo If 500, check Python script or server logs in cmd.
echo.

:: Step 3: Check if Python is installed
echo Step 3: Checking Python installation...
python --version
echo Expected: Python 3.x.x
echo If not found, install Python and add to PATH.
echo.

:: Step 4: Test the Python script with realistic data
echo Step 4: Testing generate_itinerary.py...
set TEST_JSON=[{\"id\":\"pine-grove\",\"title\":\"Pine Grove Hotel\",\"type\":\"hotel\",\"priceLabel\":\"₹2800\"},{\"id\":\"mountain-view-cafe\",\"title\":\"Mountain View Cafe\",\"type\":\"restaurant\",\"priceLabel\":\"₹300 avg/person\"},{\"id\":\"teesta-view\",\"title\":\"Teesta View Hotel\",\"type\":\"hotel\",\"priceLabel\":\"₹2300\"}]
python generate_itinerary.py "budget trip" 3 "%TEST_JSON%"
echo Expected: JSON like [{"id":"day-1","title":"Day 1","items":["pine-grove","mountain-view-cafe","teesta-view"]}]
echo If error, ensure generate_itinerary.py is in C:\Users\srish\Downloads\monastery360 (2)
echo.

:: Step 5: Check project directory for required files
echo Step 5: Checking for required files...
if exist "pages\api\generate-itinerary.js" (
    echo Found: pages/api/generate-itinerary.js
) else (
    echo Missing: pages/api/generate-itinerary.js - Create this file!
)
if exist "generate_itinerary.py" (
    echo Found: generate_itinerary.py
) else (
    echo Missing: generate_itinerary.py - Create this file in project root!
)
if exist "data\content.json" (
    echo Found: data/content.json
) else (
    echo Missing: data/content.json - Ensure data file exists!
)
if exist "lib\content.ts" (
    echo Found: lib/content.ts
) else (
    echo Missing: lib/content.ts - Ensure searchItems implementation exists!
)
if exist "pages\planner\index.tsx" (
    echo Found: pages/planner/index.tsx
) else (
    echo Missing: pages/planner/index.tsx - Ensure PlannerPage exists!
)
echo.

echo Check complete. Open http://localhost:3000/planner, enter 'budget trip' and 3 days, click 'Start Planning'.
echo Verify map displays and itinerary shows in UI. Check DevTools (F12) Console for mapUrl and itinerary logs.
echo If map fails or itinerary doesn't show, share Console logs or errors.
pause