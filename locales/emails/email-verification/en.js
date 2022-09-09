module.exports = {
    subject: "Email Verification",
    html: `
        <div style="text-align: center; font-family: Ubuntu">
        <div class="main">
            <h1>DIMLIM Email Verification</h1>
            <p>Hello {username}, we've received a request to verify your email</p>

            <h3>To verify your email, please click the next button:</h3>
            <a href="{link}" style="background-color: #5294e2; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Verify My Email</a>
        <br>
        <br>
            <p>If that didn't worked please copy and paste the next link into your search bar:</p>
            <p style="color: #5294e2">{link}</p>
        </div>

        <br>
        <br>

        <div class="footer">
            <p>If you didn't request this email, please ignore it.</p>

            <span>
                <a style="text-decoration: none" href="https://zappit.gg/support/tos">Terms of service</a> |
                <a style="text-decoration: none" href="https://zappit.gg/support/privacy">Privacy policy</a> |
                <a style="text-decoration: none" href="https://zappit.gg/support/contact">Contact us</a>
            </span>
        </div>
    </div>
    `,
};
