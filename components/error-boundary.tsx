"use client"

import { Component, ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback: (props: { resetErrorBoundary: () => void }) => ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback({ resetErrorBoundary: () => this.resetErrorBoundary() })
    }

    return this.props.children
  }

  private resetErrorBoundary() {
    this.setState({ hasError: false })
  }
} 