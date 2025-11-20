'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { CreditCard, TrendingUp, Gift, History, ArrowDownUp, Heart } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

interface CreditTransaction {
  id: string
  amount: number
  type: 'EARNED' | 'SPENT' | 'DONATED'
  message?: string
  createdAt: string
}

export function Wallet() {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showDonateDialog, setShowDonateDialog] = useState(false)
  const [donateAmount, setDonateAmount] = useState('')
  const [isDonating, setIsDonating] = useState(false)
  
  const { user, updateUser } = useAuthStore()

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/credits?userId=${user?.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDonate = async () => {
    const amount = parseInt(donateAmount)
    if (!amount || amount <= 0 || !user) return

    setIsDonating(true)
    try {
      const response = await fetch('/api/credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      })

      const data = await response.json()

      if (response.ok) {
        setShowDonateDialog(false)
        setDonateAmount('')
        updateUser({ credits: data.newBalance })
        fetchTransactions()
      } else {
        alert(data.error || 'Failed to donate credits')
      }
    } catch (error) {
      console.error('Donate error:', error)
      alert('Failed to donate credits. Please try again.')
    } finally {
      setIsDonating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNED':
        return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'SPENT':
        return <CreditCard className="w-4 h-4 text-red-600" />
      case 'DONATED':
        return <Heart className="w-4 h-4 text-purple-600" />
      default:
        return <ArrowDownUp className="w-4 h-4 text-gray-600" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'EARNED':
        return 'text-green-600'
      case 'SPENT':
        return 'text-red-600'
      case 'DONATED':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please sign in to view your wallet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {user.credits}
            </div>
            <p className="text-muted-foreground mb-4">Available Credits</p>
            
            <div className="flex gap-2 justify-center">
              <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Donate Credits
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Donate to Community</DialogTitle>
                    <DialogDescription>
                      Your donated credits will be used to fund free classes for underprivileged community members.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Amount to Donate
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max={user.credits}
                        placeholder="Enter amount"
                        value={donateAmount}
                        onChange={(e) => setDonateAmount(e.target.value)}
                      />
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">
                        <strong>Thank you for your generosity!</strong> Your donation helps make learning accessible to everyone in our community.
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowDonateDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDonate}
                        disabled={!donateAmount || parseInt(donateAmount) <= 0 || parseInt(donateAmount) > user.credits || isDonating}
                        className="flex-1"
                      >
                        {isDonating ? 'Donating...' : 'Donate'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline">
                <Gift className="w-4 h-4 mr-2" />
                Buy Credits
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="text-center p-4">
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.type === 'EARNED').reduce((sum, t) => sum + t.amount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-4">
            <CreditCard className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.type === 'SPENT').reduce((sum, t) => sum + Math.abs(t.amount), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Spent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-4">
            <Heart className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.type === 'DONATED').reduce((sum, t) => sum + Math.abs(t.amount), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Donated</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <div className="font-medium text-sm">
                        {transaction.message || transaction.type.toLowerCase()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'EARNED' ? '+' : ''}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* How to Earn Credits */}
      <Card>
        <CardHeader>
          <CardTitle>How to Earn Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">+100</Badge>
              <span className="text-sm">Sign up bonus</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">+20</Badge>
              <span className="text-sm">List your first skill</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">+10</Badge>
              <span className="text-sm">Leave a review</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">+5</Badge>
              <span className="text-sm">Join a community project</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">Variable</Badge>
              <span className="text-sm">Teach a skill (session price)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}