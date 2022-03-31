import { Component } from "react"

interface State {
  error?: any
}

export class ErrorBoundary extends Component<{}, State> {
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo)
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <p className="text-base text-red">
          {"message" in error ? error.message : error}
        </p>
      )
    }

    return this.props.children
  }
}
