const initInterceptor = (req, res, next) => {
    // Log the request method and URL
    console.log("initInterceptor start");
    
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.url}`);

    // Log request body if present
    if (Object.keys(req.body || {}).length > 0) {
        console.log('Request Body:', req.body);
    }

    // Log request params if present
    if (Object.keys(req.params || {}).length > 0) {
        console.log('Request Params:', req.params);
    }

    // Log some important headers
    console.log('Headers:', {
        'Content-Type': req.headers['content-type'],
        'Authorization': req.headers['authorization']
    });

    console.log("initInterceptor end, calling next");
    if (next.name) {
        console.log(`Next middleware or route handler: ${next.name}`);
    } else {
        console.log("Next middleware or route handler is anonymous or unnamed.");
    }
    
    // Proceed to the next middleware or route handler
    next();
};

export default initInterceptor;