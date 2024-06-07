import React from 'react';

const About = () => {
    return (
        <div style={{ width: '60%', margin: '0 auto', textAlign: 'left' }}>
            <h1>About Us</h1>
            <p>Welcome to the Crypto Portfolio Tracking App!</p>
            <p>We are a team of passionate software engineering students dedicated to simplifying the way you manage and track your cryptocurrency investments. As crypto enthusiasts ourselves, we understand the challenges of keeping track of diverse assets across multiple exchanges, which often involves dealing with complex interfaces and security concerns. Our mission is to provide a user-friendly, secure, and comprehensive solution for crypto portfolio management.</p>
            
            <h2>Our Mission</h2>
            <p>Our goal is to make cryptocurrency management accessible to everyone, regardless of technical expertise. We believe that tracking your crypto assets should be simple, intuitive, and secure. Our app is designed to help you gain a clear and comprehensive view of your investments, enabling you to make informed decisions with ease.</p>
            
            <h2>What We Offer</h2>
            <p><strong>User-Friendly Interface:</strong> Our app features an easy-to-navigate interface that allows you to manage your crypto assets effortlessly. Whether you are a beginner or an experienced trader, you will find our app intuitive and straightforward.</p>
            <p><strong>Comprehensive Asset Tracking:</strong> Track your assets across multiple exchanges without the need to consolidate them on a single platform. Our app provides a total view of your portfolio, giving you detailed insights into the performance of each asset.</p>
            <p><strong>Real-Time Data Integration:</strong> Using the Binance API, we provide real-time data updates, ensuring that you always have the latest information at your fingertips. Monitor the value of your assets and observe market trends with our dynamic charts and visualizations.</p>
            <p><strong>Enhanced Security:</strong> Your security is our priority. By using Supabase for authentication and database management, we ensure that your data is protected. Our app eliminates the need for frequent logins to multiple exchange platforms, reducing the risk of security breaches.</p>
            <p><strong>Performance Tracking:</strong> Stay informed about your portfolio’s performance with daily profit and loss calculations. Visualize historical data and track the value of your assets over different time intervals, including hourly, daily, and weekly charts.</p>
            <p><strong>Cross-Platform Accessibility:</strong> Our app is designed to work seamlessly on both mobile and desktop devices, giving you the flexibility to manage your portfolio anytime, anywhere.</p>
            
            <h2>Our Vision</h2>
            <p>We envision a future where managing cryptocurrency investments is as simple as checking your bank account. Our app is just the beginning. We are committed to continuously improving our platform, adding new features, and enhancing user experience based on your feedback.</p>
            
            <p>Thank you for choosing our Crypto Portfolio Tracking App. We are excited to have you on this journey with us. Together, let’s take the complexity out of crypto asset management and make informed investing a reality for everyone.</p>
            
            <p>Feel free to reach out to us with any questions, feedback, or suggestions. We are here to help!</p>
        </div>
    );
    
};

export default About;