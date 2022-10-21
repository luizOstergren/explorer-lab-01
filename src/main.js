import "./css/index.css"
import IMask from 'imask'

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const ccHolder = document.querySelector(".cc-holder .value")
const ccSecurity = document.querySelector(".cc-security .value")
const ccNumber = document.querySelector(".cc-number")
const ccExpiration = document.querySelector(".cc-extra .value")
const cardNumber = document.querySelector("#card-number");
const cardHolder = document.querySelector("#card-holder")
const expirationDate = document.querySelector("#expiration-date");
const securityCode = document.querySelector("#security-code");
const addButton = document.querySelector("#add-card")

var IMasked = IMask.Masked

function setCardType(type) {
    const colors = {
        visa: ['#436d99', '#2d52f2'],
        mastercard: ['#df6f29', '#c69347'],
        rocketseat: ['#0d6f5d', '#c3129c'],
        express: ['#2496fd', '#0019f6'],
        default: ['black', 'gray'],
    }

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}

// globalThis.setCardType = setCardType;

const securityCodePattern = {
    mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 000000 00000",
            regex: /(^34|^37)\d{0,13}/,
            cardtype: "express",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        const foundMask = dynamicMasked.compiledMasks.find(function (item) {
            return number.match(item.regex)
        })
        // console.log(foundMask);
        return foundMask;
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

addButton.addEventListener("click", () => {
    alert("Cartão adicionado!!")
    cardNumber.value = ""
    cardHolder.value = ""
    expirationDate.value = ""
    securityCode.value = ""

    // foundMask.reset()
})

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

cardHolder.addEventListener("input", () => {
    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

expirationDateMasked.on("accept", () => {
    updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

//   Complementos futuros
// quando adicionar o cartao, limpar todos os textos
// tem que resetar o mask pq as informaçoes ficam salvas nele, com o intuito de oder resetar o formulario
// so adicionar o cartao quando todos os inputs estiverem preenchidos corretamente