
export class UserAgent {
    ua: string;
    browser: any;
    platform: string;
    os: any;
    app: any;

    constructor(ua?: string) {
        this.ua = (ua || window.navigator.userAgent).toString().toLowerCase();
        this.browser = this.checkUserAgent(this.ua);
        this.platform = this.checkPlatform(this.ua);
        this.os = this.checkOs(this.ua);
        this.app = this.checkApp(this.ua);
    }

    checkUserAgent(ua: string) {
        const browser: any = {};
        let match: any = /(dolfin)[ \/]([\w.]+)/.exec(ua) || /(edge)[ \/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(webkit)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || (ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua)) || ["", "unknown"];

        if (match[1] === "webkit") {
            match = /(iphone|ipad|ipod)[\S\s]*os ([\w._\-]+) like/.exec(ua) || /(android)[ \/]([\w._\-]+);/.exec(ua) || [match[0], "safari", match[2]];
        } else if (match[1] === "mozilla") {
            if (/trident/.test(ua)) {
                match[1] = "msie";
            } else {
                match[1] = "firefox";
            }
        } else if (match[1] === "edge") {
            match[1] = "spartan";
        }

        browser[match[1]] = true;
        browser.name = match[1];
        browser.version = this.setVersion(match[2] as string);
        return browser;
    }

    isPc(ua: string) {
        return !!(ua.match(/linux|windows (nt|98)|macintosh/) && !ua.match(/android|mobile|polaris|lgtelecom|uzard|natebrowser|ktf;|skt;/));
    }

    isTablet(ua: string) {
        return !!(ua.match(/ipad/) || (ua.match(/android/) && !ua.match(/mobi|mini|fennec/)));
    }

    isMobile(ua: string) {
        return !!ua.match(/ip(hone|od)|android.+mobile|windows (ce|phone)|blackberry|bb10|symbian|webos|firefox.+fennec|opera m(ob|in)i|polaris|iemobile|lgtelecom|nokia|sonyericsson|dolfin|uzard|natebrowser|ktf;|skt;/);
    }

    setVersion(versionString: string) {
        const version: any = {};
        const versions = versionString ? versionString.split(/\.|-|_/) : ["0", "0", "0"];
        version.info = versions.join(".");
        version.major = versions[0] || "0";
        version.minor = versions[1] || "0";
        version.patch = versions[2] || "0";
        return version;
    }

    checkPlatform(ua: string) {
        if (this.isPc(ua)) return "pc";
        if (this.isTablet(ua)) return "tablet";
        if (this.isMobile(ua)) return "mobile";
        return "";
    }

    checkOs(ua: string) {
        const os: any = {};
        let match = /(iphone|ipad|ipod)[\S\s]*os ([\w._\-]+) like/.exec(ua) || /(android)[ \/]([\w._\-]+);/.exec(ua) || (/android/.test(ua) ? ["", "android", "0.0.0"] : false) || /(windows)(?: nt | phone(?: os){0,1} | )([\w._\-]+)/.exec(ua) || (/(windows)/.test(ua) ? ["", "windows", "0.0.0"] : false) || /(mac) os x ([\w._\-]+)/.exec(ua) || (/(linux)/.test(ua) ? ["", "linux", "0.0.0"] : false) || ["", "unknown", "0.0.0"];

        if (match[1] === "iphone" || match[1] === "ipad" || match[1] === "ipod") {
            match[1] = "ios";
        }
        os[match[1]] = true;
        os.name = match[1];
        os.version = this.setVersion(match[2] as string);
        return os;
    }

    checkApp(ua: string) {
        const app: any = {};
        const match = /(crios)[ \/]([\w.]+)/.exec(ua) || /(daumapps)[ \/]([\w.]+)/.exec(ua) || ["", ""];
        if (match[1]) {
            app.isApp = true;
            app.name = match[1];
            app.version = this.setVersion(match[2] as string);
        } else {
            app.isApp = false;
        }
        return app;
    }
}

interface CallWeb2AppOptions {
    scheme: string;
    package?: string;
    fallbackUrl: string;
    useUrlScheme?: boolean;
    universalLink?: string;
    onAppMissing?: (storeURL: string) => void;
    fail?: () => void;
}

export class CallWeb2App {
    settings: CallWeb2AppOptions;
    TIMEOUT_IOS = 2000;
    TIMEOUT_ANDROID = 3000;
    INTERVAL = 100;
    ua: any;
    os: any;

    constructor(setting: CallWeb2AppOptions) {
        this.settings = setting;
        const uaObj = new UserAgent();
        this.ua = uaObj;
        this.os = uaObj.os;
    }

    run() {
        const context = {
            urlScheme: this.settings.scheme,
            intentURI: this.settings.package ? ["intent:" + this.settings.scheme + "#Intent", "package=" + this.settings.package, "S.browser_fallback_url=" + encodeURIComponent(this.settings.fallbackUrl), 'end;'].join(';') : "",
            storeURL: this.settings.fallbackUrl,
            useUrlScheme: this.settings.useUrlScheme,
            universalLink: this.settings.universalLink,
            onAppMissing: this.settings.onAppMissing || this.moveToStore
        };

        const os = this.os;
        const onAppMissing = context.onAppMissing;

        if (os.android) {
            if (this.isIntentSupportedBrowser() && context.intentURI && !context.useUrlScheme) {
                window.location.href = context.intentURI;
            } else {
                this.deferFallback(this.TIMEOUT_ANDROID, context.storeURL, onAppMissing);
                this.launchAppViaHiddenIframe(context.urlScheme);
            }
        } else if (os.ios) {
            const tid = this.deferFallback(this.TIMEOUT_IOS, context.storeURL, onAppMissing);
            if (parseInt(this.ua.os.version.major, 10) < 8) {
                this.bindPagehideEvent(tid);
            } else {
                this.bindVisibilityChangeEvent(tid);
            }
            if (this.isSupportUniversalLinks()) {
                // replace 대신 href 사용하여 히스토리 유지
                window.location.href = context.universalLink || context.urlScheme;
            } else {
                this.launchAppViaHiddenIframe(context.urlScheme);
            }
        } else {
            window.open(context.storeURL, '_blank');
        }
    }

    isIntentSupportedBrowser() {
        const ua = this.ua;
        return ua.browser.chrome && +ua.browser.version.major >= 25;
    }

    deferFallback(timeout: number, storeURL: string, fallback: (url: string) => void) {
        const clickedAt = new Date().getTime();
        return setTimeout(() => {
            const now = new Date().getTime();
            if (this.isPageVisible() && now - clickedAt < timeout + this.INTERVAL) {
                fallback(storeURL);
            }
        }, timeout);
    }

    isPageVisible() {
        return !document.hidden;
    }

    launchAppViaHiddenIframe(urlScheme: string) {
        setTimeout(() => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = urlScheme;
            document.body.appendChild(iframe);
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 100);
    }

    bindPagehideEvent(tid: any) {
        window.addEventListener('pagehide', function clear() {
            clearTimeout(tid);
            window.removeEventListener('pagehide', clear);
        });
    }

    bindVisibilityChangeEvent(tid: any) {
        document.addEventListener('visibilitychange', function clear() {
            if (document.hidden === false) return;
            clearTimeout(tid);
            document.removeEventListener('visibilitychange', clear);
        });
    }

    isSupportUniversalLinks() {
        return parseInt(this.ua.os.version.major, 10) > 8 && this.ua.os.ios;
    }

    moveToStore(storeURL: string) {
        // replace 대신 href 사용하여 히스토리 유지 (뒤로가기 시 청첩장 유지)
        window.location.href = storeURL;
    }
}
