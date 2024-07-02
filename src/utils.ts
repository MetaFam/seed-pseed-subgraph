import { ERC20 } from "../generated/SEED-ERC20/ERC20"
import { Account, Token } from "../generated/schema"
import { BigDecimal, ethereum, Address } from "@graphprotocol/graph-ts"

export function fetchTokenDetails(event: ethereum.Event): Token | null {
  let token = Token.load(event.address.toHex())
  if (!token) {
    token = new Token(event.address.toHex())

    token.name = "Uɴᴋɴᴏᴡɴ"
    token.symbol = "𝑈𝑛𝑘𝑛𝑜𝑤𝑛"
    token.decimals = BigDecimal.zero()

    let erc20 = ERC20.bind(event.address)

    let tokenName = erc20.try_name()
    if (!tokenName.reverted) {
      token.name = tokenName.value
    }

    let tokenSymbol = erc20.try_symbol()
    if (!tokenSymbol.reverted) {
      token.symbol = tokenSymbol.value
    }

    let tokenDecimal = erc20.try_decimals()
    if (!tokenDecimal.reverted) {
      token.decimals = BigDecimal.fromString(tokenDecimal.value.toString())
    }

    token.save()
  }
  return token
}

export function fetchAccount(address: string): Account {
  let account = Account.load(address)
  if (!account) {
    account = new Account(address)
    account.save()
  }
  if(!account) throw new Error(`Failed to fetch account: "${address}".`)
  return account
}

export function fetchBalance(
  tokenAddress: Address,
  accountAddress: Address
): BigDecimal {
  let erc20 = ERC20.bind(tokenAddress)
  let tokenBalance = erc20.try_balanceOf(accountAddress)
  if(tokenBalance.reverted) {
    throw new Error(`Failed to fetch balance: "${tokenBalance.reverted.toString()}".`)
  }
  return tokenBalance.value.toBigDecimal()
}
