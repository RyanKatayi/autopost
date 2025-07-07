'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

interface ToastStore {
  toasts: ToastProps[]
  addToast: (toast: Omit<ToastProps, 'id'>) => void
  removeToast: (id: string) => void
}

let toastStore: ToastStore = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {}
}

const listeners = new Set<() => void>()

function updateStore(newStore: Partial<ToastStore>) {
  toastStore = { ...toastStore, ...newStore }
  listeners.forEach(listener => listener())
}

export function toast(options: Omit<ToastProps, 'id'>) {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast = { ...options, id }
  
  updateStore({
    toasts: [...toastStore.toasts, newToast]
  })

  if (options.duration !== 0) {
    setTimeout(() => {
      updateStore({
        toasts: toastStore.toasts.filter(t => t.id !== id)
      })
    }, options.duration || 5000)
  }

  return {
    id,
    dismiss: () => updateStore({
      toasts: toastStore.toasts.filter(t => t.id !== id)
    })
  }
}

toast.success = (title: string, description?: string) =>
  toast({ type: 'success', title, description })

toast.error = (title: string, description?: string) =>
  toast({ type: 'error', title, description })

toast.warning = (title: string, description?: string) =>
  toast({ type: 'warning', title, description })

toast.info = (title: string, description?: string) =>
  toast({ type: 'info', title, description })

export function useToast() {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const listener = () => forceUpdate({})
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return {
    toasts: toastStore.toasts,
    toast,
    dismiss: (id: string) => updateStore({
      toasts: toastStore.toasts.filter(t => t.id !== id)
    })
  }
}

function ToastIcon({ type }: { type: ToastProps['type'] }) {
  const iconClass = 'h-5 w-5'
  
  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-600`} />
    case 'error':
      return <XCircle className={`${iconClass} text-red-600`} />
    case 'warning':
      return <AlertCircle className={`${iconClass} text-yellow-600`} />
    case 'info':
      return <Info className={`${iconClass} text-blue-600`} />
  }
}

function ToastItem({ toast: toastItem, onDismiss }: { toast: ToastProps; onDismiss: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => onDismiss(toastItem.id), 300)
  }

  const bgClass = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }[toastItem.type]

  const textClass = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800'
  }[toastItem.type]

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-in-out
        ${bgClass}
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <ToastIcon type={toastItem.type} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${textClass}`}>
              {toastItem.title}
            </p>
            {toastItem.description && (
              <p className={`mt-1 text-sm ${textClass} opacity-80`}>
                {toastItem.description}
              </p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              className={`inline-flex rounded-md ${textClass} hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              onClick={handleDismiss}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-start p-4 space-y-4 sm:p-6">
      <div className="flex flex-col space-y-4 w-full">
        {toasts.map((toastItem) => (
          <ToastItem
            key={toastItem.id}
            toast={toastItem}
            onDismiss={dismiss}
          />
        ))}
      </div>
    </div>
  )
}