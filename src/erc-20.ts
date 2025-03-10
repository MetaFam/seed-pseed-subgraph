import { Transfer } from "../generated/SEED-ERC20/ERC20"
import { TokenBalance } from "../generated/schema"
import {
  fetchTokenDetails,
  fetchAccount,
  fetchBalance
} from "./utils"
import { BigDecimal } from "@graphprotocol/graph-ts"

export function handleTransfer(event: Transfer): void {
  let token = fetchTokenDetails(event)
  if(!token) return

  let fromAddress = event.params.from.toHex()
  let toAddress = event.params.to.toHex()

  let fromAccount = fetchAccount(fromAddress)
  let toAccount = fetchAccount(toAddress)

  let fromTokenBalance = TokenBalance.load(token.id + "-" + fromAccount.id)
  if (!fromTokenBalance) {
    fromTokenBalance = new TokenBalance(token.id + "-" + fromAccount.id)
    fromTokenBalance.token = token.id
    fromTokenBalance.account = fromAccount.id
  }
  fromTokenBalance.amount = fetchBalance(event.address, event.params.from)
  if(fromTokenBalance.amount != BigDecimal.zero()) {
    fromTokenBalance.save()
  }

  let toTokenBalance = TokenBalance.load(token.id + "-" + toAccount.id)
  if (!toTokenBalance) {
    toTokenBalance = new TokenBalance(token.id + "-" + toAccount.id)
    toTokenBalance.token = token.id
    toTokenBalance.account = toAccount.id
  }
  toTokenBalance.amount = fetchBalance(event.address, event.params.to)
  if (toTokenBalance.amount != BigDecimal.zero()) {
    toTokenBalance.save()
  }
}