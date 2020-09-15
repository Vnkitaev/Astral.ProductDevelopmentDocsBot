import { map } from 'lodash';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export class GoogleSpreadsheetService {
  public async getDocumentSheetRows(id: string, index: number, startFrom = 0): Promise<any> {
    const doc = new GoogleSpreadsheet(id);

    await doc.useServiceAccountAuth({
        'type': 'service_account',
        'project_id': 'noble-office-163016',
        'private_key_id': '6d78bfbbfd8493c671e94016f34e89c6f8626443',
        'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxRY/TEwhwjlhi\nPRkawn/bjB6utZbml282PxcP8qebCzvUE/tn7VQXa2hAXSaJgCffIU5cqEzLQLuE\nZNEt8tFW7DVdMIpKJnxouziYIq0s59OikvHfJbqUOb/OKU1Xj4hRpTlzB+jigNkr\nQTIM7TX8SzarnomOnrfD1bWHQ6Xss5nJ9pRKy22y0y5B2pd60M6MdXDi3wVFS/sH\nXtFbsOaVZ137aLagg9GrQV0jvXjLl+oJqlSHOP4AB2JHmIj0CuSmrA+nyWZ0ZTem\n57MkplXPGfltAF7RfhrR6i8N6VOsUyHCTZZXzM2uuvEr+L116duK5JtXU08DWfhR\nwpL+6ZbTAgMBAAECggEAEK+nC5ZhjNK2mrynNcp0EDLexSbeRuNJ5RXIMnND99yg\nAOTxR7A3t6KfuVtAoDW6IGR5WfsU4MGS77HbshMGmxjN0caauxhnTSZo+9exFvvV\nWHAI01kw+E3SnPHB+sl4apL+Vt0Pke57QqPhiwTzDXCjpeuHhYSxcH4XwbKKQOmN\nr8gTF8UoBXj/0RP6kX76YMG9DcxRznvGlDqyEqNeF0d+/UJFNX7aOV/NwoAFehjN\n/6GAH4Ue2V8+EGMlGgPtvvjWqhVyaMX1qrx4lQVp0hDU8UnsdpugwZZumi8SNfAR\n0xVnSuRqw0mJefIP//LndFV91YgKDkgQkNJxe3fCbQKBgQD4OmmU5ugJf2Mf3t6G\npdVIgO4HdXFu61l8plcuqzTl7o2R2pAcA+uyd+k3dsG/m+t3b7q5z0+HWHRWHW2A\nb78e/PjWaTdYbbWe9b9MLJjLA9tjNtgP8jOxp31QA9VxltmyuGzAiqZENVWavqW4\npxQGpgBL4nSq1r2kTIRqlzTJXwKBgQC20mwg9ly6ptThMrH9sfEQbym+JWCZyH86\nUEtbLEHmxWW08MlXMUvS6obAd8wzfhTCGF6Rot5ql7C6lFBOgwy8/KASt0P7VCDd\nBNBeqZ6/H/xjgjk//JQFjzDSQoJPK53BUxm/yamwHXTTlqthEsz5wYs9Yf4w0lMh\nY7qEeyjDDQKBgQDgzUXBLD0IHO3Qdy5gEt9NgjYPWzUXlty8HojmIvcNJTXg2WeZ\nd5OFVUNIj6x3suVUjUM186G6mUkClDQPFSSpE8DnrPIKi5DoHPbaLalScnPFLm4O\nQvK9+UlrpY0wCcWuLYeP+AEL1KFqOy4qRGXGf5/VGYk/DqtAmGtzfOy5UQKBgCHB\nD/21/sDndH5vobU5WUyzeX2F4SQDhJn7oS4gKbq1z2Vs33+dtmYmruJyO9119dcw\nMKWq8G21vAd2wqz8PSnXaqaJ9587lSW5cc9IeerHuQ2WSYOq2pl8KoNnjC+Z2fKL\nqUFjtlSx25QFSXcOxZGHTnHy2b+h1X9grlsvcgMxAoGBALIqDI4Ip/0yUdHnM7+9\nNs68F0giIluTC1h6sThOMQGZ3xe6uDv8tsYtKJPZun+uNNgPdxYOSYr2pd/vhMih\n4kkdEso4uD+qASNb/tkaE1UkFQELTXAKQz4mQnhpFDSrnX/y+GmVnJ+s8Wyk4BZx\npZQNAr7nNLVD7CaoYyea9ucR\n-----END PRIVATE KEY-----\n',
        'client_email': 'astralbot@noble-office-163016.iam.gserviceaccount.com',
        'client_id': '105591931986157542480',
        'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
        'token_uri': 'https://oauth2.googleapis.com/token',
        'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
        'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/astralbot%40noble-office-163016.iam.gserviceaccount.com'
      }
    );

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[index];
    const rows = await sheet.getRows({ offset: startFrom });

    return map(rows, r => r._rawData);
  }
}
