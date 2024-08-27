import oracledb from "oracledb";

export const connection = async () => {
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
  const conn = await connection();
  const data = await conn.execute(query, params, {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });
  conn.commit();
  await conn.close();
  return data.rows;
};
