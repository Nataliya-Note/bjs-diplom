const logoutBtn = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

// выход
logoutBtn.action = () => ApiConnector.logout(({ success }) => {
    if (success) {
        location.reload();
    }
});

// получение текущего пользователя
ApiConnector.current(({ success, data }) => {
    if (success) {
        ProfileWidget.showProfile(data);
    }
});

// вывод курсов валют
const getRates = () => ApiConnector.getStocks(({ success, data }) => {
    if (success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(data);
    }
})
getRates();
setInterval(getRates, 60000);

// пополнение счета
moneyManager.addMoneyCallback = ({ currency, amount}) => {
    return ApiConnector.addMoney({currency, amount}, ({ success, data, error }) => {
        if (success) {
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(success, 'Счет пополнен');
        }
        else {
            moneyManager.setMessage(success, error);
        }
    });
}

// конвертация валют
moneyManager.conversionMoneyCallback = ({ fromCurrency, targetCurrency, fromAmount }) => {
    ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, ({ success, data, error }) => {
        if (success) {
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(success, 'Конвертация выполнена');
        }
        else {
            moneyManager.setMessage(success, error);
        }
    });
}

// перевод средств
moneyManager.sendMoneyCallback = ({ to, amount, currency }) => {
    ApiConnector.transferMoney({ to, amount, currency }, ({ success, data, error }) => {
        if (success) {
            ProfileWidget.showProfile(data);
            moneyManager.setMessage(success, 'Перевод осуществлён');
        }
        else {
            moneyManager.setMessage(success, error);
        }
    });
}

// Работа с избранным
ApiConnector.getFavorites(({ success, data }) => {
    if (success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data);
        moneyManager.updateUsersList(data);
    }
});

favoritesWidget.addUserCallback = ({ id, name }) => {
    ApiConnector.addUserToFavorites({ id, name }, ({ success, data, error }) => {
        if (success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(data);
            moneyManager.updateUsersList(data);
        }
        else {
            moneyManager.setMessage(success, error);
        }
    });
}

favoritesWidget.removeUserCallback = (userId) => {
    ApiConnector.removeUserFromFavorites(userId, ({ success, data, error }) => {
        if (success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(data);
            moneyManager.updateUsersList(data);
        }
        else {
            moneyManager.setMessage(success, error);
        }
    });
}