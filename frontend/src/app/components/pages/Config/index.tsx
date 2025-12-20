import {Box, Grid, Paper} from '@mui/material';
import {CategoriesCtxProvider} from "@/app/domains/category/CategoriesContext.tsx";
import CategoryManagement from "@/app/domains/category/comp/CategoryManagement.tsx";
import {AggrsCtxProvider} from "@/app/domains/aggr/AggrsContext.tsx";
import AggrManagement from "@/app/domains/aggr/comp/AggrManagement.tsx";
import {TagsCtxProvider} from "@/app/domains/tag/TagsContext.tsx";
import TagManagement from "@/app/domains/tag/comp/TagManagement.tsx";

const ConfigPage = () => {
  return (
    <CategoriesCtxProvider>
      <TagsCtxProvider>
        <Box sx={{p: 3}}>
          <Grid container spacing={3}>
            <Grid size={{xs: 12, md: 6}}>
              <Paper sx={{p: 2, height: '100%'}}>
                <CategoryManagement/>
              </Paper>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Paper sx={{p: 2, height: '100%'}}>
                <AggrsCtxProvider>
                  <AggrManagement/>
                </AggrsCtxProvider>
              </Paper>
            </Grid>

            <Grid size={{xs: 12, md: 6}}>
              <Paper sx={{p: 2, height: '100%'}}>
                <TagManagement/>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </TagsCtxProvider>
    </CategoriesCtxProvider>
  );
};

export default ConfigPage;