module.exports = (connection, DataTypes) => {
    const schema = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter your name.',
                },
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter your email.',
                },
                isEmail: {
                    msg: 'Please enter a valid email.',
                },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter your Password.',
                },
                len: {
                    args: [8, 100],
                    msg: 'Your Password must contain at least 8 characters.',
                },
            },
        },
    };

    const ReaderModel = connection.define('Reader', schema);
    return ReaderModel;
};