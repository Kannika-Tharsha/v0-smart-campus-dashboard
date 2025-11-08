"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeamMember {
  name: string
  email: string
}

interface RegistrationFormData {
  teamName: string
  teamMembers: TeamMember[]
  collegeName: string
  collegeId: string
  phoneNumber: string
}

interface TeamRegistrationModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type RegistrationStep = "team-info" | "payment" | "success"

export default function TeamRegistrationModal({ event, isOpen, onClose, onSuccess }: TeamRegistrationModalProps) {
  const [step, setStep] = useState<RegistrationStep>("team-info")
  const [formData, setFormData] = useState<RegistrationFormData>({
    teamName: "",
    teamMembers: [{ name: "", email: "" }],
    collegeName: "",
    collegeId: "",
    phoneNumber: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [qrScanned, setQrScanned] = useState(false)

  if (!isOpen) return null

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.teamName.trim()) {
      newErrors.teamName = "Team name is required"
    }
    if (!formData.collegeName.trim()) {
      newErrors.collegeName = "College name is required"
    }
    if (!formData.collegeId.trim()) {
      newErrors.collegeId = "College ID is required"
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits"
    }

    // Validate team members
    const filledMembers = formData.teamMembers.filter((m) => m.name.trim() || m.email.trim())
    if (filledMembers.length === 0) {
      newErrors.teamMembers = "At least one team member is required"
    }
    filledMembers.forEach((member, index) => {
      if (!member.name.trim()) {
        newErrors[`member${index}Name`] = "Member name is required"
      }
      if (!member.email.trim()) {
        newErrors[`member${index}Email`] = "Member email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
        newErrors[`member${index}Email`] = "Invalid email"
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }
    return true
  }

  const handleAddMember = () => {
    if (formData.teamMembers.length < 3) {
      setFormData({
        ...formData,
        teamMembers: [...formData.teamMembers, { name: "", email: "" }],
      })
    }
  }

  const handleRemoveMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers.filter((_, i) => i !== index),
    })
  }

  const handleMemberChange = (index: number, field: "name" | "email", value: string) => {
    const newMembers = [...formData.teamMembers]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setFormData({ ...formData, teamMembers: newMembers })
  }

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setErrors({})
      setStep("payment")
    }
  }

  const handleQrScan = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setQrScanned(true)
    setIsProcessing(false)

    // Auto transition to success after 1 second
    setTimeout(() => {
      setStep("success")
    }, 1000)
  }

  const handleCompleteRegistration = () => {
    setQrScanned(false)
    setStep("team-info")
    setFormData({
      teamName: "",
      teamMembers: [{ name: "", email: "" }],
      collegeName: "",
      collegeId: "",
      phoneNumber: "",
    })
    setErrors({})
    onSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Step 1: Team Information */}
        {step === "team-info" && (
          <>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Team Registration</p>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Entry Fee */}
              <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Entry Fee per Team</span>
                  <span className="text-2xl font-bold text-primary">₹{event.price}</span>
                </div>
              </div>

              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => {
                    setFormData({ ...formData, teamName: e.target.value })
                    if (errors.teamName) setErrors({ ...errors, teamName: "" })
                  }}
                  placeholder="Enter your team name"
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName}</p>}
              </div>

              {/* Team Members */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-foreground">
                    Team Members (Max 3) <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-muted-foreground">{formData.teamMembers.length}/3</span>
                </div>
                <div className="space-y-3">
                  {formData.teamMembers.map((member, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">Member {index + 1}</span>
                        {formData.teamMembers.length > 1 && (
                          <button
                            onClick={() => handleRemoveMember(index)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                          placeholder="Name"
                          className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, "email", e.target.value)}
                          placeholder="Email"
                          className="px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      {errors[`member${index}Name`] && (
                        <p className="text-red-500 text-xs">{errors[`member${index}Name`]}</p>
                      )}
                      {errors[`member${index}Email`] && (
                        <p className="text-red-500 text-xs">{errors[`member${index}Email`]}</p>
                      )}
                    </div>
                  ))}
                </div>
                {errors.teamMembers && <p className="text-red-500 text-sm mt-2">{errors.teamMembers}</p>}
                {formData.teamMembers.length < 3 && (
                  <button
                    onClick={handleAddMember}
                    className="mt-3 px-3 py-1 text-sm text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    + Add Member
                  </button>
                )}
              </div>

              {/* College Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => {
                      setFormData({ ...formData, collegeName: e.target.value })
                      if (errors.collegeName) setErrors({ ...errors, collegeName: "" })
                    }}
                    placeholder="e.g., MIT, Stanford"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.collegeName && <p className="text-red-500 text-sm mt-1">{errors.collegeName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    College ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.collegeId}
                    onChange={(e) => {
                      setFormData({ ...formData, collegeId: e.target.value })
                      if (errors.collegeId) setErrors({ ...errors, collegeId: "" })
                    }}
                    placeholder="e.g., CODE-001"
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.collegeId && <p className="text-red-500 text-sm mt-1">{errors.collegeId}</p>}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    setFormData({ ...formData, phoneNumber: value })
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: "" })
                  }}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-input rounded-lg font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Payment with QR Scanner */}
        {step === "payment" && (
          <>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">Payment</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Scan QR Code to Complete Payment</p>
              </div>
              <button
                onClick={() => setStep("team-info")}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Summary */}
              <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team Name</span>
                  <span className="font-medium text-foreground">{formData.teamName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">College</span>
                  <span className="font-medium text-foreground">{formData.collegeName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Team Members</span>
                  <span className="font-medium text-foreground">
                    {formData.teamMembers.filter((m) => m.name.trim()).length}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Amount to Pay</span>
                  <span className="text-xl font-bold text-primary">₹{event.price}</span>
                </div>
              </div>

              {/* QR Scanner Area */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {!qrScanned ? (
                  <>
                    <div className="relative w-48 h-48 border-4 border-dashed border-primary rounded-lg flex items-center justify-center bg-primary/5">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-sm font-medium text-foreground mb-3">Click to Scan QR Code</p>
                        <button
                          onClick={handleQrScan}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          {isProcessing ? "Processing..." : "Scan QR"}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Click "Scan QR" button to simulate QR code scanning
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">✓</span>
                    </div>
                    <p className="font-medium text-foreground">Payment Successful!</p>
                    <p className="text-sm text-muted-foreground">Your QR code has been scanned</p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep("team-info")}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 border border-input rounded-lg font-medium text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Success Message */}
        {step === "success" && (
          <>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="flex-1">
                <CardTitle className="text-2xl">Registration Completed</CardTitle>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                ✕
              </button>
            </CardHeader>
            <CardContent className="space-y-6 text-center py-8">
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-5xl">✓</span>
                </div>
              </div>

              {/* Success Messages */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-green-600">Registration Successful!</h3>
                <p className="text-foreground font-medium">Payment Received</p>
              </div>

              {/* Registration Details */}
              <div className="bg-secondary/30 p-6 rounded-lg space-y-3 text-left">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Team Name</p>
                  <p className="text-lg font-semibold text-foreground">{formData.teamName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Event</p>
                  <p className="text-lg font-semibold text-foreground">{event.title}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Team Members</p>
                  <div className="space-y-1">
                    {formData.teamMembers
                      .filter((m) => m.name.trim())
                      .map((member, idx) => (
                        <p key={idx} className="text-foreground">
                          {idx + 1}. {member.name} ({member.email})
                        </p>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">College</p>
                  <p className="text-foreground">
                    {formData.collegeName} (ID: {formData.collegeId})
                  </p>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Amount Paid</p>
                  <p className="text-2xl font-bold text-primary">₹{event.price}</p>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  A confirmation email has been sent to the registered team members. See you at the event!
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCompleteRegistration}
                className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
