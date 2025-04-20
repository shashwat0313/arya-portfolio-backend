const interceptor = (req, res, next) => {
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

    // for intercepting reponse
    // Store the original res.send method
    const originalSend = res.send;

    // Override res.send
    res.send = function (body) {
        console.log("Response Interceptor start (send override start)");
        console.log("Response Status:", res.statusCode);
        console.log("Response Headers:", JSON.stringify(res.getHeaders()));
        console.log("Response Body:", body);
        console.log("Response Interceptor end (send override end) ... calling send");
            
        // Call the original res.send with the body
        return originalSend.call(this, body);
    };

    // Proceed to the next middleware or route handler
    next();
};

export default interceptor;