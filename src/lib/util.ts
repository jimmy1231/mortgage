import _ from 'lodash'

export interface FixedParams {
  rate: number
  amortization: number
  principal: number
}

export interface Monthly {
  interest: number,
  principal: number
}

function roundTo(val: number, decimals: number) {
  return Math.round(val * 100) / 100
}

export function fixed(params: FixedParams): Monthly[] {
  // monthly interest rate
  let r = params.rate / 12

  // number of monthly payments
  let N = params.amortization * 12

  // mortgage principal - amount borrowed
  let P = params.principal

  let c = (r * P * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1)

  if (r == 0) {
    throw new Error('interest rate cannot be 0')
  }

  let totalPrincipalOwed = P
  let totalPrincipalPaid = 0
  let M: Monthly[] = []
  for (let n = 0; n < N; n++) {
    let amountOwed = (1 + r) * totalPrincipalOwed - c
    let interestToPay = roundTo(totalPrincipalOwed * r, 2)
    let principalPaid = roundTo(c - interestToPay, 2)

    M.push({ 
      interest: interestToPay, 
      principal: principalPaid 
    })

    totalPrincipalPaid += principalPaid
    totalPrincipalOwed -= principalPaid
  }

  M[M.length - 1].principal = roundTo(M[M.length - 1].principal + totalPrincipalOwed, 2)

  console.log({totalPrincipalOwed, totalPrincipalPaid})

  return M
}