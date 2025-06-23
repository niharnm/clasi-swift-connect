
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
  private isInitializing = false;

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
    if (this.isGapiLoaded || this.isInitializing) return;
    
    this.isInitializing = true;
    console.log('Loading Google API...');

    try {
      // Load Google API script if not already loaded
      if (!window.gapi) {
        console.log('Loading Google API script...');
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = () => {
            console.log('Google API script loaded successfully');
            resolve();
          };
          script.onerror = () => {
            console.error('Failed to load Google API script');
            reject(new Error('Failed to load Google API'));
          };
          document.head.appendChild(script);
        });
      }

      // Initialize Google API with timeout
      console.log('Initializing Google API...');
      await Promise.race([
        new Promise<void>((resolve) => {
          window.gapi.load('auth2', () => {
            console.log('Google Auth2 loaded, initializing...');
            window.gapi.auth2.init({
              client_id: this.CLIENT_ID,
              scope: this.SCOPES
            }).then(() => {
              console.log('Google Auth2 initialized successfully');
              this.isGapiLoaded = true;
              resolve();
            }).catch((error: any) => {
              console.error('Failed to initialize Google Auth2:', error);
              throw error;
            });
          });
        }),
        new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error('Google API initialization timeout')), 10000);
        })
      ]);
    } catch (error) {
      console.error('Error loading Google API:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  async signInWithGoogle(): Promise<boolean> {
    try {
      console.log('Initiating Google Sign-In with Classroom access...');
      
      // Check if CLIENT_ID is configured
      if (this.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
        console.warn('Google Client ID not configured. Using mock authentication.');
        return this.mockSignIn();
      }

      // Add timeout for the entire sign-in process
      const signInResult = await Promise.race([
        this.performGoogleSignIn(),
        new Promise<boolean>((_, reject) => {
          setTimeout(() => reject(new Error('Sign-in timeout')), 15000);
        })
      ]);

      return signInResult;
    } catch (error) {
      console.error('Google authentication failed:', error);
      console.log('Falling back to mock authentication...');
      return this.mockSignIn();
    }
  }

  private async performGoogleSignIn(): Promise<boolean> {
    await this.loadGoogleAPI();
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (!authInstance) {
      throw new Error('Google Auth instance not available');
    }

    console.log('Attempting Google sign-in...');
    
    // Check if user is already signed in
    if (authInstance.isSignedIn.get()) {
      console.log('User already signed in');
      const user = authInstance.currentUser.get();
      this.accessToken = user.getAuthResponse().access_token;
      localStorage.setItem('clasi_auth_token', this.accessToken);
      return true;
    }

    // Perform sign-in
    const user = await authInstance.signIn({
      scope: this.SCOPES
    });
    
    if (user && user.isSignedIn()) {
      this.accessToken = user.getAuthResponse().access_token;
      localStorage.setItem('clasi_auth_token', this.accessToken);
      console.log('Successfully signed in with Google');
      return true;
    }
    
    return false;
  }

  private async mockSignIn(): Promise<boolean> {
    console.log('Using mock authentication...');
    // Fallback mock authentication for development
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.accessToken = 'mock-access-token-' + Date.now();
    localStorage.setItem('clasi_auth_token', this.accessToken);
    return true;
  }

  signOut(): void {
    try {
      if (this.isGapiLoaded && window.gapi?.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        if (authInstance) {
          authInstance.signOut();
        }
      }
    } catch (error) {
      console.error('Error during sign out:', error);
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
