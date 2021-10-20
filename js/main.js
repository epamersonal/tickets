async function getSearchId() {
    await fetch("https://front-test.beta.aviasales.ru/search")
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .then((data) => {
            let id = data.searchId;
            return fetch('https://front-test.beta.aviasales.ru/tickets?searchId='+id);
        })
        .then((data) => {
            data = data.json();
            return data;
        })
        .then((ticketsPart) => {
            let arr = [];
            for (let i = 0; i< ticketsPart.tickets.length; i++) {
                if (!document.getElementsByClassName('input')[1].checked) {
                    arr.push(ticketsPart.tickets[i]);
                }
            }
            arr = arr.slice(0,5);

            for (let i = 0; i < arr.length; i++) {
                let ticket = document.createElement('div');
                ticket.className = "ticket";
                ticket.innerHTML = '<div class="ticket__header"><div class="ticket__price"></div><div class="ticket__logo"><img src={carrier} alt="" /></div></div><div class="ticket_data-wrapper"></div>';
                document.querySelector('.tickets').append(ticket);
            }
            function populate() {
                let prices = document.getElementsByClassName('ticket__price');
                for (let i = 0; i < prices.length; i++) {
                    prices[i].innerHTML = arr[i].price + " Р";
                }
                let logos = document.getElementsByClassName('ticket__logo');
                for (let i = 0; i < logos.length; i++) {
                    logos[i].innerHTML = `<img src="http://pics.avs.io/99/36/${arr[i].carrier}.png"/>`;
                }
                function stops(Stops) {
                    switch (Stops) {
                        case 0:
                            return "Без пересадок";
                        case 1:
                            return "1 пересадка";
                        default:
                            return `${Stops} пересадки`;
                    }
                }
                let stopPoints = document.getElementsByClassName('ticket_data__stops');
                for (let i = 0; i < stopPoints.length; i++) {
                    stopPoints[i].innerHTML = stops(1);
                }
                let ticketData = document.getElementsByClassName('ticket_data-wrapper');
                for (let i = 0; i < ticketData.length; i++) {
                    ticketData[i].innerHTML = arr[i].segments.map(function(segment) {
                        return '<div class="ticket_data">'+'<div class="ticket_data__item">'+'<p class="ticket_data__grey">'+segment.origin+' - '+segment.destination+'</p><p>'+timeOutIn(segment.date,segment.duration)+'</p></div><div class="ticket_data__item"><p class="ticket_data__grey">В пути</p><p>'+timeInTrack(segment.duration)+'</p></div>'+'<div class="ticket_data__item"><p class="ticket_data__grey">'+stops(segment.stops.length)+'</p><p>'+segment.stops.join(", ")+'</p></div></div>';
                    }).join('')+'</div>';
                }
                
                function timeOutIn(date, time) {
                    let dateOut = new Date(date);
                    const outHours = dateOut.getHours();
                    const outMinutes = dateOut.getMinutes();
                    const inHours = new Date(dateOut.setHours(dateOut.getHours() + Math.ceil(time / 60))).getHours();
                    const inMinutes = new Date(dateOut.setMinutes(dateOut.getMinutes() + time)).getMinutes();
                    return outHours + ":" + outMinutes + " - " + inHours + ":" + inMinutes;
                }
                function timeInTrack(duration) {
                    return Math.ceil(duration / 60) + ":" + (duration % 60);
                }
                function stops(Stops) {
                    switch (Stops) {
                        case 0:
                            return "Без пересадок";
                        case 1:
                            return "1 пересадка";
                        default:
                            return `${Stops} пересадки`;
                    }
                }
            }

           populate();
           
            document.querySelector('.filter2__low-price').addEventListener('click', sortByPrice);
            function sortByPrice() {
                this.classList.add('filter2__element__clicked');
                document.querySelector('.filter2__faster').classList.remove('filter2__element__clicked');
                arr.sort((a,b) => a.price - b.price);
                populate();
            }
            document.querySelector('.filter2__faster').addEventListener('click', sortBySpeed);

            function sortBySpeed() {
                this.classList.add('filter2__element__clicked');
                document.querySelector('.filter2__low-price').classList.remove('filter2__element__clicked');
                function s(arr) {
                    return arr.sort((a,b) => {
                        return (a.segments[0].duration+a.segments[1].duration) - (a.segments[0].duration + b.segments[1].duration);
                    });
                }
                s(arr);
                populate();
            }

            let checkboxes = document.getElementsByClassName('input');
            for (let i = 0; i < checkboxes.length; i++ ) {
                checkboxes[i].addEventListener('change', filterTickets);
            }
           
            function filterTickets() {
                arr.length = 0;
                for (let i = 0; i< ticketsPart.tickets.length; i++) {
                    if (checkboxes[0].checked) {
                        arr.push(ticketsPart.tickets[i]);
                    } else if (checkboxes[1].checked && ticketsPart.tickets[i].segments[0].stops.length === 0 && ticketsPart.tickets[i].segments[1].stops.length === 0) {
                        arr.push(ticketsPart.tickets[i]);
                    } else if (checkboxes[2].checked && ticketsPart.tickets[i].segments[0].stops.length === 1 && ticketsPart.tickets[i].segments[1].stops.length === 1) {
                        arr.push(ticketsPart.tickets[i]);
                    } else if (checkboxes[3].checked && ticketsPart.tickets[i].segments[0].stops.length === 2 && ticketsPart.tickets[i].segments[1].stops.length === 2) {
                        arr.push(ticketsPart.tickets[i]);
                    } else if (checkboxes[4].checked && ticketsPart.tickets[i].segments[0].stops.length === 3 && ticketsPart.tickets[i].segments[1].stops.length === 3) {
                        arr.push(ticketsPart.tickets[i]);
                    } else if (!this.checked) {
                        arr.push(ticketsPart.tickets[i]);
                    }
                }
                populate();
            }
        })
}
getSearchId();

