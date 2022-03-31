import { Component } from "react"

import { Header } from "@/components"

interface Props {
  showHeader?: boolean
}

interface State {
  error?: any
}

export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo)
  }

  render() {
    const { error } = this.state || {}
    if (error) {
      return (
        <>
          {this.props.showHeader && <Header />}

          <p className="text-base text-red">
            {"message" in error ? error.message : error}
          </p>
        </>
      )
    }

    return this.props.children
  }
}
