import React from "react";

interface MenuErrorBoundaryProps {
  children: React.ReactNode;
}

interface MenuErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary dedicato al menu pubblico.
 * Intercetta crash di rendering (es. cache con shape obsoleto dopo un deploy)
 * e mostra un messaggio chiaro con bottone di reload cache-bust, evitando
 * la pagina bianca per il cliente finale.
 */
export class MenuErrorBoundary extends React.Component<
  MenuErrorBoundaryProps,
  MenuErrorBoundaryState
> {
  constructor(props: MenuErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): MenuErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Logging diagnostico in console
    // eslint-disable-next-line no-console
    console.error("[MenuErrorBoundary] Errore di rendering del menu:", error, info);
  }

  private handleReload = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(Date.now()));
      window.location.replace(url.toString());
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
          <div className="max-w-md w-full text-center space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Si è verificato un problema nel caricamento del menu
            </h1>
            <p className="text-sm text-muted-foreground">
              Premi il pulsante qui sotto per ricaricare la pagina.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default MenuErrorBoundary;