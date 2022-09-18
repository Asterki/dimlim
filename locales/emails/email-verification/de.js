export const subject = "E-Mail-Verifizierung";
export const html = `
    <div style="text-align: center; font-family: Ubuntu">
        <div class="main">
            <h1>DIMLIM-E-Mail-Verifizierung</h1>
            <p>Hallo {username}, wir haben eine Anfrage zur Bestätigung Ihrer E-Mail-Adresse erhalten</p>

            <h3>Um Ihre E-Mail zu bestätigen, klicken Sie bitte auf die Schaltfläche „Weiter“:</h3>
            <a href="{link}" style="background-color: #5294e2; color: white; padding: 10px; border-radius: 5px; text-decoration: none;">Verify My Email</a>
        <br>
        <br>
            <p>Wenn das nicht funktioniert hat, kopieren Sie bitte den nächsten Link und fügen Sie ihn in Ihre Suchleiste ein:</p>
            <p style="color: #5294e2">{link}</p>
        </div>

        <br>
        <br>

        <div class="footer">
            <p>Wenn Sie diese E-Mail nicht angefordert haben, ignorieren Sie sie bitte.</p>
        </div>
    </div>

    `;
