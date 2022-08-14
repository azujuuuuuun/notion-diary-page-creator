import { Client } from "@notionhq/client";
import dayjs from "dayjs";
import "dayjs/locale/ja.js";

const notion = new Client({ auth: process.env.NOTION_API_TOKEN });

const diaryDatabaseId = process.env.NOTION_DIARY_DATABASE_ID;

(async () => {
  console.log("Creating diary page started.");

  try {
    const now = dayjs().locale("ja");

    const response = await notion.databases.query({
      database_id: diaryDatabaseId,
      filter: {
        property: "Date",
        date: {
          equals: now.format("YYYY-MM-DD"),
        },
      },
    });

    if (response.results.length > 0) {
      console.log("Today's diary page was already created.");
      process.exit(0);
    }

    await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: diaryDatabaseId,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: now.format("YYYY/MM/DD(ddd)"),
              },
            },
          ],
        },
        Date: {
          date: {
            start: now.format("YYYY-MM-DD"),
          },
        },
      },
    });

    console.log("Today's diary page was created successfully.");
  } catch (error) {
    console.error(error.body);
  }
})();
