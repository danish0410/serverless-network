export const hello = async (event: any) => {
    console.log("EVENT:", JSON.stringify(event));

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from Lambda 🚀"
        })
    };
};


// module.exports.hello = async (event) => {
//     return {
//         statusCode: 200,
//         body: JSON.stringify({
//             message: "1st serverless deploy - us-east-2"
//         }),
//     };
// };

// module.exports.hello = async (event) => {
//     const region = process.env.AWS_REGION;

//     let message;

//     if (region === "ap-south-2") {
//         message = "Hello from Hyderabad region 🚀";
//     } else if (region === "us-east-2") {
//         message = "Hello from Ohio region 🚀";
//     } else {
//         message = `Hello from ${region}`;
//     }

//     return {
//         statusCode: 200,
//         body: JSON.stringify({ message }),
//     };
// };