
export class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithGoogle(): Promise<boolean> {
    try {
      // In a real implementation, this would use Google Sign-In
      // For demo purposes, we'll simulate authentication
      console.log('Initiating Google Sign-In...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful authentication
      this.accessToken = 'mock-access-token-' + Date.now();
      localStorage.setItem('clasi_auth_token', this.accessToken);
      
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  signOut(): void {
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
