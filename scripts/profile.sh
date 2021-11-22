# 
# This profiler script will run a series of commands to run the firestarter server,
# ping the server's specific routes, and collect profile data for the nodejs algorithm
# that runs when that route is activated
# 

# Leverage pm2 to start server on specific port:
PORT=4000 CAMPAIGN_PROFILER=true pm2 start npm --name fs-profiler -- run server

# Wait for server to start and then ping with post request to run campaign
npx wait-on http://localhost:4000

# Use apache benchmark to post request to campaign route with sample JSON
ab -T 'application/json'  -n 1 -p scripts/sample.json http://localhost:4000/api/campaign

# Cleanup running process
pm2 stop fs-profiler
pm2 delete fs-profiler