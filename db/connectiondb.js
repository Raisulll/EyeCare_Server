import oracledb from "oracledb";

export const connect = async () => {
  try {
    const connectionData = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECTION_STRING,
    });
    console.log("Connected to Oracle Database");
    return connectionData;
  } catch (err) {
    console.error(err);
  }
};

export const run_query = async (query, params) => {
  const conn = await connect();
  const data = await conn.execute(query, params, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });
  conn.commit();
  await conn.close();
  return data.rows;
};

export const runCursorQuery = async (query, params) => {
  try {
    const connection = await connect();
    if (!connection) {
      throw new Error("Failed to establish connection");
    }

    params = {
      ...params,
      cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
    };

    const result = await connection.execute(query, params, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      resultSet: true,
    });

    const resultSet = result.outBinds.cursor;
    let rows = [];
    let row;

    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }

    await resultSet.close();
    connection.commit();
    await connection.close();

    return rows;
  } catch (err) {
    throw new Error(err.message);
  }
};

