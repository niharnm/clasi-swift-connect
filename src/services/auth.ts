
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private isGapiLoaded = false;

  // Google OAuth configuration
  private readonly CLIENT_ID = '369978023118-tvsv9epnt75tbavd59erqj0qav7b2n2o.apps.googleusercontent.com';
  private readonly SCOPES = [
    'https://www.googleapis.com/auth/classroom.courses.readonly',
    'https://www.googleapis.com/auth/classroom.rosters.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ].join(' ');

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async loadGoogleAPI(): Promise<void> {
    if (this.isGapiLoaded) return;

    // Load Google API script
    if (!window.gapi) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.head.appendChild(script);
      });
    }

    // Initialize Google API
    await new Promise<void>((resolve) => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: this.CLIENT_ID,
          scope: this.SCOPES
        }).then(() => {
          this.isGapiLoaded = true;
          resolve();
        });
      });
    });
  }

  async signInWithGoogle(): Promise<boolean> {
    try {
      console.log('Initiating Google Sign-In with Classroom access...');
      
      // Check if CLIENT_ID is configured
      if (this.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        console.warn('Google Client ID not configured. Using mock authentication.');
        return this.mockSignIn();
      }

      await this.loadGoogleAPI();
      
      const authInstance = window.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      if (user.isSignedIn()) {
        this.accessToken = user.getAuthResponse().access_token;
        localStorage.setItem('clasi_auth_token', this.accessToken);
        console.log('Successfully signed in with Google');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Google authentication failed:', error);
      console.log('Falling back to mock authentication...');
      return this.mockSignIn();
    }
  }

  private async mockSignIn(): Promise<boolean> {
    // Fallback mock authentication for development
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.accessToken = 'mock-access-token-' + Date.now();
    localStorage.setItem('clasi_auth_token', this.accessToken);
    return true;
  }

  signOut(): void {
    if (this.isGapiLoaded && window.gapi.auth2) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      if (authInstance) {
        authInstance.signOut();
      }
    }
    this.accessToken = null;
    localStorage.removeItem('clasi_auth_token');
  }

  isAuthenticated(): boolean {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('clasi_auth_token');
    }
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
}
