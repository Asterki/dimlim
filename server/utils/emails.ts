import fs from 'fs/promises'
import path from 'path'

import subjects from "../../shared/emails/subjects.json"
import { AvailableLocales, EmailNames } from '../../shared/types'

const getEmailContent = async (email: EmailNames, locale: AvailableLocales) => {
    const emailContent = await fs.readFile(path.join(__dirname, `../../shared/emails/${email}/${locale}.html`), { encoding: "utf8" })
    const emailSubject = subjects[email][locale]

    return {
        content: emailContent,
        subject: emailSubject
    };
}

export { getEmailContent }